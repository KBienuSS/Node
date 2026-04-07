const { existsSync } = require('node:fs');
const Jimp = require('jimp');
const inquirer = require('inquirer');

const addTextWatermarkToImage = async function(inputFile, outputFile, text) {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    const textData = {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };
    image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
    await image.quality(100).writeAsync(outputFile);
    console.log('Success');
    startApp();
  }
  catch(error) {
    console.log('Something went wrong... Try again!'); 
  }
};

const addImageWatermarkToImage = async function(inputFile, outputFile, watermarkFile) {
  try{
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;

    image.composite(watermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.5,
    });
    await image.quality(100).writeAsync(outputFile);
    console.log('Success');
    startApp();
  }
  catch(error) {
    console.log('Something went wrong... Try again!'); 
  }
};

const prepareOutputFilename = (string) => {
    const arr = string.split('.');
    const ext = arr.pop();
    const name = arr.join('.');
    return `${name}-with-watermark.${ext}`;
}

const editImage = async (inputFile) => {
  const { wantsEdit } = await inquirer.prompt([{
    name: 'wantsEdit',
    type: 'confirm',
    message: 'Do you want to edit the image before watermarking?',
  }]);

  if (!wantsEdit) return;

  const { modification } = await inquirer.prompt([{
    name: 'modification',
    type: 'list',
    message: 'What modification do you want to apply?',
    choices: ['make image brighter', 'increase contrast', 'make image b&w', 'invert image'],
  }]);

  try {
    const image = await Jimp.read(inputFile);

    if (modification === 'make image brighter') image.brightness(0.3);
    else if (modification === 'increase contrast')  image.contrast(0.3);
    else if (modification === 'make image b&w') image.greyscale();
    else if (modification === 'invert image') image.invert();

    await image.quality(100).writeAsync(inputFile);
    console.log('Image edited successfully!');
  } catch(error) {
    console.log('Something went wrong during editing... Try again!');
    console.error(error);
  }
};

const startApp = async () => {

  // Ask if user is ready
  const answer = await inquirer.prompt([{
      name: 'start',
      message: 'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
      type: 'confirm'
    }]);

  // if answer is no, just quit the app
  if(!answer.start) process.exit();

  // ask about input file and watermark type
  const options = await inquirer.prompt([{
    name: 'inputImage',
    type: 'input',
    message: 'What file do you want to mark?',
    default: 'test.jpg',
  }, {
    name: 'watermarkType',
    type: 'list',
    choices: ['Text watermark', 'Image watermark'],
  }]);

  const inputPath = './img/' + options.inputImage;

  if(options.watermarkType === 'Text watermark') {

    const text = await inquirer.prompt([{
        name: 'value',
        type: 'input',
        message: 'Type your watermark text:',
    }]);

    options.watermarkText = text.value;

    if (existsSync(inputPath)){ 
        await editImage(inputPath); 
        await addTextWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), options.watermarkText);
    } else console.log('Something went wrong... Try again.');
  }

  else {
    const image = await inquirer.prompt([{
        name: 'filename',
        type: 'input',
        message: 'Type your watermark name:',
        default: 'logo.png',
    }]);

    options.watermarkImage = image.filename;

    if (existsSync(inputPath) && existsSync('./img/'+image.filename)){ 
        await editImage(inputPath); 
        await addImageWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), './img/' + options.watermarkImage);
    } else console.log('Something went wrong... Try again.');
  }

}

startApp();