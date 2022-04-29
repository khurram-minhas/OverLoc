import React, { useState, useEffect, useRef } from 'react';
import './Profile.scss';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import UploadImage from '../Icon/uploadImage.png';
import { isNullOrUndefined, showSnackBar, TextAbstract } from '../utils/Global';
import Avatar from '../Icon/img_avatar.png';
import EditPost from './EditPost';

function Profile({ user, setUser, setTotalCreatedAds, totalCreatedAds  }) {
  const [rockFetchPost] = useRockFetchPost();
  const [rockFetchGet] = useRockFetchGet();
  const [localUser, setLocalUser] = useState(user);
  const [displayAds, setDisplayAds] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  useEffect(
    () => {
      async function fetchData() {
        if (isNullOrUndefined(user)) return;
        const res = await rockFetchPost('/getUserAds', { id: user.ID });
        if (isNullOrUndefined(res)) return;
        setDisplayAds(res.reverse());
      }
      setLocalUser(user);
      fetchData();
    },
    [selectedPost],
    user
  );
  useEffect(() => {
    if (localUser !== user) {
      setIsDirty(true);
    }
  }, [localUser]);
  function uploadImage(e) {
    const element = document.getElementById('upload-photo');
    element.click();
  }
  // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
  function resizedataURL(datas) {
    return new Promise(async function (resolve, reject) {
      // We create an image to receive the Data URI
      var img = document.createElement('img');

      // When the event "onload" is triggered we can resize the image.
      img.onload = function () {
        // We create a canvas and get its context.
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // We set the dimensions at the wanted size.
        canvas.width = (this.width / 4);
        canvas.height = (this.height / 4);

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(this, 0, 0, (this.width / 4), (this.height / 4));

        var dataURI = canvas.toDataURL();

        // This is the return of the Promise
        resolve(dataURI);
      };

      // We put the Data URI in the image's src attribute
      img.src = datas;
    });
  }
  function onUploadImageSelected(e) {
    function getBase64(file) {
      var reader = new FileReader();
      if (isNullOrUndefined(file)) return;
      reader.readAsDataURL(file);
      reader.onload = async function () {
        var newDataUri = await resizedataURL(reader.result);
          const res = await rockFetchPost('/uploadImage', {
            id: user.ID,
            url: newDataUri,
          });
          if (isNullOrUndefined(res)) return;
          setUser({ ...user, ProfilePic: reader.result });
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }

    const element = document.getElementById('upload-photo');
    var file = element.files[0];
    getBase64(file); // prints the base64 string
  }
  async function deleteAd(id) {
    const res = await rockFetchPost('/deleteAd', { id });
    if (isNullOrUndefined(res)) return;
    const updatedAds = displayAds.filter((post) => post.ID !== id);
    setDisplayAds(updatedAds);
    if(setTotalCreatedAds)
      setTotalCreatedAds(totalCreatedAds - 1)

  }
  function getRow() {
    if (displayAds.length === 0) return 'No Record Found!';
    return displayAds.map((posts) => (
      <div className='profileAdsRow flex'>
        <div className='profileDetail '>
          <div className='profileName'>{posts.FirstName.split(' ')[0]}</div>
          <img
            src={user && user.ProfilePic ? user.ProfilePic : Avatar}
            alt='Avatar'
            className='profilePicture'
          ></img>
        </div>
        <div className='unApprovedPostDesc' style={{ height: 100 }}>
          {TextAbstract(posts.Description)}
        </div>
        <div className='unApprovedPostDetails flex'>
          <div className='w50 paddingLeft5'>
            <div className='maxEstimatedCost'>
              {posts.MaxEstimatedBudget + '€'}
            </div>
            {/*
            <div className='budetDetails'>
              de {posts.MinEstimatedBudget + '€'} a {posts.MaxEstimatedBudget}
            </div> */}
            <div className='budetDetails'>Semaines {posts.WeeksInMonth}</div>
            <div className='budetDetails'>{posts.AreaOfApartment}</div>
          </div>
          <div className='w50 align-self-center'>
            <div className='approveButton' onClick={() => deleteAd(posts.ID)}>
              Delete
            </div>
            <div className='editPost' onClick={() => setSelectedPost(posts)}>
              Edit
            </div>
          </div>
        </div>
      </div>
    ));
  }
  function getDOB() {
    if (localUser && localUser.DOB) {
      return localUser.DOB;
    }
    return null;
  }

  async function saveProfile(e) {
    if (isNullOrUndefined(localUser)) return;
    if (
      localUser.FirstName === '' ||
      localUser.Gender === '' ||
      localUser.University === ''
    ) {
      showSnackBar('Details cannot be empty!');
      return;
    }
    const body = {
      firstName: localUser.FirstName,
      email: localUser.Email,
      gender: localUser.Gender,
      dob: localUser.DOB,
      university: localUser.University,
      id: user.ID,
    };
    const result = await rockFetchPost('/updateUser', body);
    if (result === null) {
      showSnackBar('Profile Update Failed, Try another email!');
      return;
    }
    showSnackBar('Profile Updated successful!');
    setIsDirty(false);
    setUser(localUser);
  }

  if (!isNullOrUndefined(selectedPost)) {
    return (
      <EditPost selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
    );
  }
  return (
    <div className='w100 h100'>
      <div className='profileHeader'>
        <div className='w100 h100'>
          <div className='row minWH100 padding1'>
            <div className='col-md-4 centerAlignImage'>
              <img
                onClick={uploadImage}
                src={user && user.ProfilePic ? user.ProfilePic : Avatar}
                className='w100 uploadImageIcon'
                alt='Upload'
              />
              {/* <i class="fa fa-camera"  onClick={uploadImage}  aria-hidden="true"></i> */}

              {/* <div className='overlay'>
                  <div className='text'>Hello World</div>
                </div> */}
              <input
                type='file'
                name='photo'
                id='upload-photo'
                accept='image/png, image/jpeg'
                onChange={onUploadImageSelected}
              />
            </div>
            <div className='col-md-8'>
              <div className='row save-parent'>
                <i
                  class='fa fa-save'
                  onClick={saveProfile}
                  style={{
                    cursor: isDirty ? 'pointer' : 'not-allowed',
                    color: isDirty ? 'black' : 'lightgray',
                  }}
                ></i>
              </div>
              <div className='row minWH10040 paddingTop5'>
                <input
                  className='profile-Name'
                  value={localUser && localUser.FirstName}
                  onChange={(e) =>
                    setLocalUser({ ...localUser, FirstName: e.target.value })
                  }
                />
              </div>
              <div className='row minWH10060'>
                <div className='row w100'>
                  <div className='col-md-6 padding0'>
                    <input
                      className='profileDetail-profile '
                      value={localUser && localUser.Email}
                      onChange={(e) =>
                        setLocalUser({ ...localUser, Email: e.target.value })
                      }
                    />
                  </div>
                  <div className='col-md-6 padding0'>
                    <select
                      className='phoneCode'
                      name='gender'
                      id='gender'
                      value={localUser && localUser.Gender}
                      onChange={(e) =>
                        setLocalUser({ ...localUser, Gender: e.target.value })
                      }
                    >
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                  </div>
                </div>
                <div className='row w100'>
                  <div className='col-md-6 padding0'>
                    <input
                      className='profileDetail-profile'
                      value={localUser && localUser.University}
                      onChange={(e) =>
                        setLocalUser({
                          ...localUser,
                          University: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='col-md-6 padding0'>
                    <input
                      className='profileDetail-profile'
                      value={getDOB()}
                      type='date'
                      id='birthday'
                      name='birthday'
                      onChange={(e) =>
                        setLocalUser({ ...localUser, DOB: e.target.value })
                      }
                      min='1950-01-01'
                      max='2005-12-31'
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bodyUserAds'>{getRow()}</div>
    </div>
  );
}
export default Profile;
