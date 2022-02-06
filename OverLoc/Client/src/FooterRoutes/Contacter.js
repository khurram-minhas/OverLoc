import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import Logo from '../Icon/RMlogo.png';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import {
  isNullOrUndefined,
  showSnackBar,
  validateEmail,
} from '../utils/Global';
import moment from 'moment';
import { ERoute } from '../ERoute';
import RMModal from '../RMModal/RMModal';
import emailjs from '@emailjs/browser';

function Contracter({ setRoute }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const form = useRef();
  const [displayModal, setDisplayModal] = useState(false);
  const [errors, setErrors] = useState('');
  const [description, setDescription] = useState('');
  async function createAccount(e) {
    e.preventDefault();
    let error = '';
    // console.log(document.getElementById('profileImage').files[0].name);
    if (isNullOrUndefined(phone)) {
      error += 'Please Insert Phone #!\n';
    }
    if (isNullOrUndefined(email) || !validateEmail(email)) {
      error += 'Please Insert Email!\n';
    }
    if (isNullOrUndefined(description)) {
      error += 'Please Insert Password!\n';
    }
    if (error !== '') {
      showSnackBar(error);
    }
    let isError = false;
    emailjs.sendForm(`gmail`, e.target, 'service_bxu4j0u').then(
      (result) => {
        alert('Message Sent, We will get back to you shortly', result.text);
      },
      (error) => {
        showSnackBar('An error occurred, Please try again', error.text);
        isError = true;
      }
    );
    if (!isError) showSnackBar('Email successfuly sent!');
  }
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_bxu4j0u',
        'template_o3sniso',
        form.current,
        'user_nQ6JDeDJeQqxsIuhxeJn7'
      )
      .then(
        (result) => {
          showSnackBar(result.text);
        },
        (error) => {
          showSnackBar(error.text);
        }
      );
  };
  return (
    <div className='mainContainer'>
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
              <form ref={form} onSubmit={sendEmail}>
                <div className='row signUpFrom'>
                  <div className='row signUpFromInner'>
                    <div className='col-md-12'>
                      <div className='row signUpFromInnerRow'>
                        <div className='row signUpFromInnerRow'>
                          <div className='col-md-6'>
                            <div className='formTitle'>Name</div>
                          </div>
                          <div className='col-md-6 man'>
                            <div className='formMandatory'>champ requis</div>
                          </div>
                        </div>
                        <div className='row signUpFromInnerRow'>
                          <div className='col-md-12 text-align-left flex align-items-center'>
                            <input
                              type='text'
                              className='formTextField'
                              name='from-name'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-12'>
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
                          <div className='col-md-12 text-align-left flex align-items-center'>
                            <input
                              type='text'
                              className='formTextField'
                              name='from-email'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='row signUpFromInnerRow'>
                        <div className='row signUpFromInnerRow'>
                          <div className='col-md-6'>
                            <div className='formTitle'>Message</div>
                          </div>
                          <div className='col-md-6 man'>
                            <div className='formMandatory'>champ requis</div>
                          </div>
                        </div>
                        <div className='row signUpFromInnerRow'>
                          <div className='col-md-12 text-align-left flex align-items-center'>
                            <input
                              type='text'
                              className='formTextField'
                              name='message'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <button className='submitButton' type='submit'>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              {/* <div className='col-md-6'>
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
                        onChange={(e) => setEmail(e.target.value)}
                        className='formTextField'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='row signUpFromInnerRow'>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-6'>
                      <div className='formTitle'>Phone #</div>
                    </div>
                    <div className='col-md-6 man'>
                      <div className='formMandatory'>champ requis</div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-12'>
                      <input
                        type='text'
                        className='formTextField'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='col-md-12'>
                <div className='row signUpFromInnerRow'>
                  <div className='col-md-6'>
                    <div className='formTitle'>Description</div>
                  </div>
                  <div className='col-md-6 man'>
                    <div className='formMandatory'>champ requis</div>
                  </div>
                </div>
                <div className='row signUpFromInnerRow'>
                  <input
                    type='text'
                    className='formTextField formTextFieldDescription'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contracter;
