import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { generateRules } from '@/lib/apriori';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const supportRaw = formData.get('support');
        const confidenceRaw = formData.get('confidence');

        const support = supportRaw ? parseFloat(supportRaw as string) : 0.05;
        const confidence = confidenceRaw ? parseFloat(confidenceRaw as string) : 0.3;

        console.log(`Analyzing file: ${file?.name}, Support: ${support}, Confidence: ${confidence}`);

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const text = await file.text();

        let transactions: string[][] = [];

        // Parse CSV synchronously
        const parseResult = Papa.parse(text, {
            header: true,
            skipEmptyLines: true
        });

        if (parseResult.errors.length > 0) {
            console.error("CSV Parse Errors:", parseResult.errors);
        }

        const data = parseResult.data as any[];
        // Group by Transaction ID
        const grouped = new Map<string, string[]>();

        let hasTransactionColumn = false;
        let hasItemColumn = false;

        data.forEach((row, index) => {
            // Flexible column matching
            const keys = Object.keys(row);
            const txKey = keys.find(k => k.toLowerCase() === 'transaction' || k.toLowerCase() === 'id' || k.toLowerCase().includes('invoice'));
            const itemKey = keys.find(k => k.toLowerCase() === 'item' || k.toLowerCase() === 'product' || k.toLowerCase().includes('description'));

            if (txKey) hasTransactionColumn = true;
            if (itemKey) hasItemColumn = true;

            const txId = txKey ? row[txKey] : null;
            const item = itemKey ? row[itemKey] : null;

            if (txId && item) {
                if (!grouped.has(txId)) grouped.set(txId, []);
                grouped.get(txId)?.push(item);
            }
        });

        transactions = Array.from(grouped.values());

        if (transactions.length === 0) {
            console.error("No transactions found. Columns detected:", hasTransactionColumn, hasItemColumn);
            return NextResponse.json({
                error: 'Could not parse transactions. Ensure CSV has Transaction and Item columns.'
            }, { status: 400 });
        }

        console.log(`Found ${transactions.length} transactions. Running Apriori...`);
        const rules = generateRules(transactions, support, confidence);
        console.log(`Found ${rules.length} rules.`);

        return NextResponse.json({ results: rules });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: 'Analysis failed: ' + String(error) }, { status: 500 });
    }
}
