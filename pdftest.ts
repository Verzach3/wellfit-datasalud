import {readPdfText} from 'pdf-text-reader';

async function main() {
    const pdfText: string = await readPdfText({filePath: './pd.pdf'});
    console.info(pdfText);
}

main();