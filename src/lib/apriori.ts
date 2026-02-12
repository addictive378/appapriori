export interface AssociationRule {
    antecedents: string[];
    consequents: string[];
    support: number;
    confidence: number;
    lift: number;
}

/**
 * Calculates the support of an itemset in the transactions.
 */
function calculateSupport(itemset: Set<string>, transactions: Set<string>[]): number {
    let count = 0;
    for (const transaction of transactions) {
        let hasAll = true;
        for (const item of itemset) {
            if (!transaction.has(item)) {
                hasAll = false;
                break;
            }
        }
        if (hasAll) count++;
    }
    return count / transactions.length;
}

function getCombinations<T>(set: Set<T>, k: number): Set<T>[] {
    const array = Array.from(set);
    if (k === 1) return array.map(v => new Set([v]));

    const combinations: Set<T>[] = [];
    const helper = (start: number, current: T[]) => {
        if (current.length === k) {
            combinations.push(new Set(current));
            return;
        }
        for (let i = start; i < array.length; i++) {
            helper(i + 1, [...current, array[i]]);
        }
    };
    helper(0, []);
    return combinations;
}

function joinItemsets(itemsets: Set<string>[], k: number): Set<string>[] {
    const nextCandidates: Set<string>[] = [];
    const len = itemsets.length;

    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            const setA = Array.from(itemsets[i]);
            const setB = Array.from(itemsets[j]);

            // Check if first k-2 items are same (optimization for generating k-sized itemsets)
            // But for simplicity with Sets, we can just union and check size
            const union = new Set([...setA, ...setB]);
            if (union.size === k) {
                // Determine if all subsets of size k-1 are frequent? (Pruning step - skipped for simplicity here unless performance needed)
                // We'll just add to candidates and let support counting filter it

                // Avoid duplicates
                const exists = nextCandidates.some(c =>
                    c.size === union.size && [...c].every(x => union.has(x))
                );
                if (!exists) {
                    nextCandidates.push(union);
                }
            }
        }
    }
    return nextCandidates;
}

export function generateRules(transactionsRaw: string[][], minSupport: number, minConfidence: number): AssociationRule[] {
    const transactions = transactionsRaw.map(t => new Set(t));
    const n = transactions.length;

    // 1. Generate L1 (Frequent 1-itemsets)
    const itemCounts = new Map<string, number>();
    transactions.forEach(t => {
        t.forEach(item => {
            itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
        });
    });

    let frequentItemsets: { itemset: Set<string>, support: number }[] = [];
    let currentItemsets: Set<string>[] = [];

    for (const [item, count] of itemCounts.entries()) {
        const support = count / n;
        if (support >= minSupport) {
            const set = new Set([item]);
            currentItemsets.push(set);
            frequentItemsets.push({ itemset: set, support });
        }
    }

    // 2. Generate Lk
    let k = 2;
    while (currentItemsets.length > 0) {
        // Generate candidates Ck from L(k-1)
        // Simple join: take union of all pairs, if size == k
        const candidates: Set<string>[] = [];

        // Better join approach:
        // sort itemsets to easily compare?
        // naive approach:
        for (let i = 0; i < currentItemsets.length; i++) {
            for (let j = i + 1; j < currentItemsets.length; j++) {
                const u = new Set([...currentItemsets[i], ...currentItemsets[j]]);
                if (u.size === k) {
                    // check if not already in candidates
                    if (!candidates.some(c => [...c].every(x => u.has(x)))) {
                        candidates.push(u);
                    }
                }
            }
        }

        // Optimizations like pruning can be added here

        const nextFrequentItemsets: Set<string>[] = [];
        for (const candidate of candidates) {
            const support = calculateSupport(candidate, transactions);
            if (support >= minSupport) {
                nextFrequentItemsets.push(candidate);
                frequentItemsets.push({ itemset: candidate, support });
            }
        }

        currentItemsets = nextFrequentItemsets;
        k++;
        // Safety break
        if (k > 10) break;
    }

    // 3. Generate Rules
    const rules: AssociationRule[] = [];

    for (const { itemset, support: supportUnion } of frequentItemsets) {
        if (itemset.size < 2) continue;

        // Generate all non-empty proper subsets
        // A rule is A -> B where A subset I, B = I - A
        const items = Array.from(itemset);
        // Get all subsets size 1 to len-1
        // We can use bitmask for all subsets
        const totalSubsets = 1 << items.length;
        for (let i = 1; i < totalSubsets - 1; i++) {
            const antecedents: string[] = [];
            const consequents: string[] = [];

            for (let j = 0; j < items.length; j++) {
                if ((i & (1 << j)) !== 0) {
                    antecedents.push(items[j]);
                } else {
                    consequents.push(items[j]);
                }
            }

            // Calculate confidence
            // support(A)
            const antecedentSet = new Set(antecedents);
            // Find support of antecedent
            // We can optimize by looking up in frequentItemsets if we stored them efficiently
            // or just recalculate
            const supportAntecedent = calculateSupport(antecedentSet, transactions);

            const confidence = supportUnion / supportAntecedent;

            if (confidence >= minConfidence) {
                const lift = confidence / calculateSupport(new Set(consequents), transactions);
                rules.push({
                    antecedents,
                    consequents,
                    support: supportUnion,
                    confidence,
                    lift
                });
            }
        }
    }

    return rules;
}
