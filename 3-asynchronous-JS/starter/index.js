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

/*
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
    throw err;
  } finally {
    console.log('Random dog image saved to file');
  }
  return 'READY';
};
*/
/*
// Reading the returned value from a async function
// 1)
getDogPic()
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.log(err.message);
  });
  */
/*
// 2)
(async () => {
  try {
    const value = await getDogPic();
    console.log(value);
  } catch (err) {
    console.error(err);
  }
})();
*/
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

///////////////////////////////////////////////////////////////////////////////{
// Waiting multiple promises at the same time
const getDogPic2 = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);
    await writeFilePromise('dog-img.txt', imgs.join('\n'));
  } catch (err) {
    console.log(err);

    throw err;
  }
  return 'READY';
};
(async () => {
  const result = await getDogPic2();
  console.log(result);
})();
