// const { getBannerContent } = require('../utils/controllers');
// const { bannerContent } = require('../utils/database');
const request = require('../utils/server');

function checkServerStatus(testCallbackFn) {
  const path = '/status';
  request(path, (err, data) => {
    if (err) {
      testCallbackFn(err);
    } else {
      testCallbackFn(null, data);
    }
  });
}

function fetchBannerContent(testCallbackFn) {
  const path = '/banner';
  request(path, (err, bannerData) => {
    if (err) {
      testCallbackFn(err);
    } else {
      const copyBannerData = { ...bannerData };
      copyBannerData.copyrightYear = 2023;
      testCallbackFn(null, copyBannerData);
    }
  });
}

function fetchAllOwners(testCallbackFn) {
  const path = '/owners';
  request(path, (err, ownerData) => {
    if (err) {
      testCallbackFn(err);
    } else {
      const newOwnerData = ownerData.map(name => {
        // console.log(name.toLowerCase());
        return name.toLowerCase();
      });
      testCallbackFn(null, newOwnerData);
    }
  });
}

function fetchCatsByOwner(owner, testCallbackFn) {
  const path = `/owners/${owner}/cats`;
  request(path, (err, catData) => {
    if (err) {
      testCallbackFn(err);
    } else {
      testCallbackFn(null, catData);
    }
  });
}

function fetchCatPics(catArray, testCallbackFn) {
  if (catArray.length === 0) {
    testCallbackFn(null);
  }
  const catPicArr = [];
  let counter = 0;
  for (let i = 0; i < catArray.length; i++) {
    const path = `/pics/${catArray[i]}`;
    request(path, (err, catPic) => {
      if (err) {
        catPicArr.push('placeholder.jpg');
      } else {
        catPicArr.push(catPic);
      }
      counter++;
      if (counter === catArray.length) {
        testCallbackFn(null, catPicArr);
      }
    });
  }
}

function fetchAllCats(testCallbackFn) {
  const allCats = [];

  fetchAllOwners((err, owners) => {  // goes to the API
    // console.log(owners)
    for (let i = 0; i < owners.length; i++) {
      fetchCatsByOwner(owners[i], (err, cats) => { // goes to the API
        allCats.push(cats);
        // console.log(allCats)
        console.log('inside Cats');
        if (owners.length === allCats.length) {
          // console.log(allCats)
          const kats = allCats.flat();
          kats.sort();
          testCallbackFn(null, kats);
        }
      });
      console.log('outside Owners ',i);
    }
  });
}

function fetchOwnersWithCats(testCallbackFn) {
  const ownersWithCats = [];
  let counter = 0;
  fetchAllOwners((err, owners) => {
    owners.forEach((owner, index) => {
      fetchCatsByOwner(owner, (err, cats) => {
        ownersWithCats[index] = {'owner': owner, 'cats': cats}
        counter++;
        if (owners.length === counter) {
          testCallbackFn(null, ownersWithCats)
        }
      })

    })
  })
}

function kickLegacyServerUntilItWorks() {}

function buySingleOutfit() {}

module.exports = {
  buySingleOutfit,
  checkServerStatus,
  kickLegacyServerUntilItWorks,
  fetchAllCats,
  fetchCatPics,
  fetchAllOwners,
  fetchBannerContent,
  fetchOwnersWithCats,
  fetchCatsByOwner
};
