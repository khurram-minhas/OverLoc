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

function Contracter() {
  const form = useRef();
  const [rockFetchGet] = useRockFetchGet();
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
