

exports.pdf = (req, res) => {
  var fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
  };

  try {
    var PdfPrinter = require('pdfmake');
    var printer = new PdfPrinter(fonts);
    var fs = require('fs');

    //Process data
    let content = []
    let data = req.body.data
    let i = 0
    data.blocks.forEach((block) => {
      console.log('working on block: ', i, block.type)
      switch (block.type) {
        case 'header':
          content[i] = block.data.text;
          break;
        case 'paragraph':
          content[i] = block.data.text;
          break;
        case 'list':
          let bulletPoint = '* ';

          block.data.items.forEach((item, j) => {
            block.data.style === 'unordered' ? bulletPoint = '* ' : bulletPoint = j + 1 + '. '
            content[i] = bulletPoint + item
            i++
          })
          break;
        default:
          content[i] = block.data.text;
      }
      i++;
    })

    console.log('CONTENT:', content)
    var docDefinition = {
      content: content
    };


    var options = {

    }

    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream('document_test.pdf'));
    pdfDoc.end();
    return res.status(200).json({ Status: "PDF created" });
  }
  catch (err) {
    return res.status(400).json({ Status: "Error, PDF NOT created" });
  }
}