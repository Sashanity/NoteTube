let myData = {
  "data": {
    "time": 1554920381017,
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text":
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text":
            "This is a test one line paragraph 2"
        }
      },


      {
        "type": "header",
        "data": {
          "text": "Header 1 level 2",
          "level": 2
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text":
            "This is a test sentence number one.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        }
      },
      {
        "type": "list",
        "data": {
          "style": "unordered",
          "items": [
            "It is a block-styled editor",
            "It returns clean data output in JSON",
            "Designed to be extendable and pluggable with a simple API"
          ]
        }
      },
      {
        "type": "header",
        "data": {
          "text": "Header 2 level 1",
          "level": 1
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text":
            "This is a test sentence number two"
        }
      },
      {
        "type": "header",
        "data": {
          "text": "Header 3 level 5",
          "level": 5
        }
      },
      {
        "type": "list",
        "data": {
          "style": "ordered",
          "items": [
            "It is a block-styled editor",
            "It returns clean data output in JSON",
            "Designed to be extendable and pluggable with a simple API"
          ]
        }
      }
    ],
    "version": "2.12.4"
  }
}


let fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};
let styles = {
  header1: {
    fontSize: 22,
    bold: true
  },
  header2: {
    fontSize: 20,
    bold: true
  },
  header3: {
    fontSize: 18,
    bold: true
  },
  header4: {
    fontSize: 16,
    bold: true
  },
  header5: {
    fontSize: 14,
    bold: true
  },
  header6: {
    fontSize: 12,
    bold: true
  },

  anotherStyle: {
    italics: true,
    alignment: 'right'
  }
}
exports.pdf = (req, res) => {
  try {
    var PdfPrinter = require('pdfmake');
    var printer = new PdfPrinter(fonts);
    var fs = require('fs');

    // let data = req.body.data
    let data = myData.data

    let content = processData(data)

    console.log('CONTENT:', content)
    var docDefinition = {
      content: content,
      styles: styles
    };

    var options = {}

    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream('document_test.pdf'));
    pdfDoc.end();
    return res.status(200).json({ Status: "PDF created" });
  }
  catch (err) {
    return res.status(400).json({ Status: "Error, PDF NOT created" });
  }
}

/**
 * This method gets json like object and puts it in array that pdfmake can print out
 * @param {*} data  json like object
 * @returns content array of strings
 */
function processData(data) {
  let content = []
  let i = 0
  data.blocks.forEach((block) => {
    console.log('working on block: ', i, block.type)
    switch (block.type) {
      case 'header':
        let style
        switch (block.data.level) {
          case 1:
            style = 'header1';
            break;
          case 2:
            style = 'header2';
            break;
          case 3:
            style = 'header3';
            break;
          case 4:
            style = 'header4';
            break;
          case 5:
            style = 'header5';
            break;
          case 6:
            style = 'header6';
            break;
          default:
            style = 'header1'
        }
        content[i] = { text: block.data.text, style: style }
        // content[i].style = 'header';
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
  return content
}