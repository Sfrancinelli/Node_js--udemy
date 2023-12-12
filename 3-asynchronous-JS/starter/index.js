const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) reject(err.message);
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err.message);
      resolve('Success');
    });
  });
};

// Same process with async/await
const getDogPic = async () => {
  try {
    const breed = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${breed}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${breed}/images/random`
    );
    await writeFilePromise('dog-img.txt', res.body.message);
  } catch (error) {
    console.error(error.message);
  } finally {
    console.log('Random dog image saved to file');
  }
};

getDogPic();

/*
// Promesified version of the read file and wrte file.
// This is done to escape callback hell
// Using promises and consuming them with the then method
readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);

    return writeFilePromise('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file');
  })
  .catch((err) => {
    console.log('Error!');
    console.error(err.message);
  });

  */

/*
fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, (err) =>
        console.error(err)
      );
    })
    .catch((err) => {
      console.log('Error!');
      console.error(err.message);
    });
});
*/
