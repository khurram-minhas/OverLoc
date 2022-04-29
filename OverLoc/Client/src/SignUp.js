import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import Logo from './Icon/RMlogo.png';
import './SignUp.scss';
import useRockFetchGet, { useRockFetchPost } from './utils/RockFetch';
import { ERoute } from './ERoute';
import {
  isNullOrUndefined,
  showSnackBar,
  validateEmail,
} from './utils/Global';
import moment from 'moment';
import RMModal from './RMModal/RMModal';
import AutoComplete from '@mui/material/Button';
import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import ConditionGenerales from './FooterRoutes/Conditions-generales';
import QuiSommes from './FooterRoutes/QuiSommes';
import Contracter from './FooterRoutes/Contacter';
import Footer from './Footer';
var universityNames = require('./utils/university_name.json'); //with path
function SignUp({ setRoute }) {
  const [rockFetchPost] = useRockFetchPost();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [mob, setMob] = useState('');
  const [yob, setYob] = useState('');
  const [university, setUniversity] = useState('');
  const [gender, setGender] = useState('Male');
  const [password, setPassword] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [localRoute, setLocalRoute] = useState(ERoute.SignUp);
  const [errors, setErrors] = useState('');
  const OPTIONS_LIMIT = 50;
  const defaultFilterOptions = createFilterOptions();
  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
  };
  async function createAccount(e) {
    e.preventDefault();
    let error = '';
    // console.log(document.getElementById('profileImage').files[0].name);
    if (isNullOrUndefined(firstName)) {
      error += 'Please Insert First Name!\n';
    }
    if (isNullOrUndefined(email) || !validateEmail(email)) {
      error += 'Please Insert Email!\n';
    }
    if (isNullOrUndefined(password)) {
      error += 'Please Insert Password!\n';
    }
    if (isNullOrUndefined(gender)) {
      error += 'Please Insert Gender!\n';
    }
    // if (isNullOrUndefined(university)) {
    //   error += 'Please Insert University!\n';
    // }
    var decimal =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (
      !isNullOrUndefined(password) &&
      (!(password.length >= 8 && password.length <= 20) ||
        !password.match(decimal))
    ) {
      error +=
        'Password between 8 and 20 characters with at least one capital letter one small letter one number and a special character!\n';
    }

    const date = mob.toString() + '/' + dob.toString() + '/' + yob.toString();
    if (!moment(date, 'MM/DD/YYYY', true).isValid()) {
      error += 'Please Insert a correct date\n';
    }
    if (!isNullOrUndefined(error)) {
      setErrors(error);
      setDisplayModal(true);
      return;
    }
    const dobForDB =
      yob.toString() + '-' + mob.toString() + '-' + dob.toString();
    const body = {
      firstName,
      email,
      password,
      dob: dobForDB,
      gender,
      university,
      userTypeId: 2,
    };
    const result = await rockFetchPost('/insertUser', body);
    if (result === null) {
      showSnackBar('SignUp Failed, Try another email!');
      return;
    }
    showSnackBar('SignUp successful!');
    setRoute(ERoute.Login);
  }
  function signUpRenderer() {
    return (
      <>
        <RMModal
          showModal={displayModal}
          setShowModal={setDisplayModal}
          onOk={() => setDisplayModal(false)}
          body={errors}
          heading='Cannot Signup'
          okButtonText={'Ok'}
          noButtonText={'Cancel'}
          isOkOnly={true}
        />
        <div className='innerContainerSignUp' align='center'>
          <div className='innerContainerChildSignUp height80' align='center'>
            <div className='row signUpFrom'>
              <div className='row signUpFromInner height70'>
                <div className='col-md-6'>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>Prénom</div>
                      </div>
                      <div className='col-md-6 man'>
                        <div className='formMandatory'>champ requis</div>
                      </div>
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12'>
                        <input
                          type='text'
                          value={firstName}
                          onChange={(e) =>
                            e.target.value.length > 50
                              ? null
                              : setFirstName(e.target.value)
                          }
                          className='formTextField'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>Email</div>
                      </div>
                      <div className='col-md-6 man'>
                        <div className='formMandatory'>champ requis</div>
                      </div>
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12'>
                        <input
                          type='email'
                          value={email}
                          onChange={(e) =>
                            e.target.value.length > 50
                              ? null
                              : setEmail(e.target.value)
                          }
                          className='formTextField'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>Mot de passe</div>
                      </div>
                      <div className='col-md-6 man'>
                        <div className='formMandatory'>champ requis</div>
                      </div>
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12'>
                        <input
                          type='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='formTextField'
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className='row signUpFromInnerRow'>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-6'>
                      <div className='formTitle'>Profile Picture</div>
                    </div>
                    <div className='col-md-6 man'>
                      <div className='formMandatory'>champ requis</div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-12'>
                      <input
                        type='file'
                        id='profileImage'
                        name='img'
                        accept='image/*'
                        className='formTextField'
                        onChange={setProfileImageState}
                      />
                    </div>
                  </div>
                </div> */}
                </div>
                <div className='col-md-6'>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>Date de naissance</div>
                      </div>
                      <div className='col-md-6 man'>
                        <div className='formMandatory'>champ requis</div>
                      </div>
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12 text-align-left flex align-items-center'>
                        <input
                          type='number'
                          className='dayAndMonth'
                          placeholder='dd'
                          min='1'
                          max='31'
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                        <input
                          type='number'
                          className='dayAndMonth'
                          placeholder='mm'
                          min='1'
                          max='12'
                          value={mob}
                          onChange={(e) => setMob(e.target.value)}
                        />
                        <input
                          type='number'
                          className='year'
                          placeholder='yy'
                          min='0000'
                          max={new Date().getFullYear()}
                          value={yob}
                          onChange={(e) => setYob(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>Sexe</div>
                      </div>
                      <div className='col-md-6 man'>
                        <div className='formMandatory'>champ requis</div>
                      </div>
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12 text-align-left'>
                        <select
                          className='phoneCode'
                          name='gender'
                          id='gender'
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>École supérieure</div>
                      </div>
                      {/* <div className='col-md-6 man'>
                      <div className='formMandatory'>champ requis</div>
                    </div> */}
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12' style={{ padding: '2%' }}>
                        <Autocomplete
                          id='auto-complete'
                          autoComplete
                          includeInputInList
                          options={universityNames}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField {...params} variant='standard' />
                          )}
                          filterOptions={filterOptions}
                          onChange={(e) =>
                            !isNullOrUndefined(e.target.value) &&
                            e.target.value.length > 100
                              ? null
                              : setUniversity(e.target.value)
                          }
                        />
                        {/* <input
                        type='text'
                        className='formTextField'
                        value={university}
                        onChange={(e) =>
                          e.target.value.length > 100
                            ? null
                            : setUniversity(e.target.value)
                        }
                      /> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-12'>
                  <button className='submitButton' onClick={createAccount}>
                    CRÉER UN COMPTE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  function getRenderer() {
    if (localRoute === ERoute.SignUp) return signUpRenderer();
    else if (localRoute === ERoute.ConditionGenerales)
      return <ConditionGenerales />;
    else if (localRoute === ERoute.QuiSommes) return <QuiSommes />;
    else if (localRoute === ERoute.Contracter)
      return <Contracter setLocalRoute={setRoute} />;
  }
  return (
    <>
      <div className='mainContainer'>
        <div className='headerRow'>
          <div className='headerTitle'>
            <img
              className='titleImage'
              src={Logo}
              onClick={() => setRoute(ERoute.Welcome)}
              style={{ cursor: 'pointer' }}
              alt='RM title'
              width={700}
            />
          </div>
        </div>

        <div className='innerContainer alignItemsCenter'>{getRenderer()}</div>
      </div>
      <Footer setRoute={setLocalRoute} />
    </>
  );
}
export default SignUp;
