import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import RMModal from '../RMModal/RMModal';
import '../SignUp.scss';
import {
  isNullOrUndefined,
  showSnackBar,
  validateEmail,
} from '../utils/Global';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import { Autocomplete, createFilterOptions, TextField } from '@mui/material';

var zip_code = require('../utils/zip_code.json'); //with path
function EditPost({ selectedPost, setSelectedPost }) {
  const [rockFetchPost] = useRockFetchPost();
  const [rockFetchGet] = useRockFetchGet();
  const [title, setTitle] = useState('');
  // const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumer] = useState('');
  const [phoneCode, setPhoneCode] = useState('+33');
  const [areaOfApartment, setAreaOfApartment] = useState('');
  const [dob, setDob] = useState('');
  const [mob, setMob] = useState('');
  const [yob, setYob] = useState('');
  const [checkBoxesVisibility, setCheckBoxesVisibility] = useState(false);
  const [minEstimatedBudget, setMinEstimatedBudget] = useState(0);
  const [maxEstimatedBudget, setMaxEstimatedBudget] = useState(0);
  const [weeksInMonth, setWeeksInMonth] = useState([]);
  const [description, setDescription] = useState('');
  const [apartmentType, setApartmentType] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [errors, setErrors] = useState('');
  const OPTIONS_LIMIT = 50;
  const defaultFilterOptions = createFilterOptions();
  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
  };
  useEffect(() => {
    if (!isNullOrUndefined(selectedPost)) {
      setTitle(selectedPost.Title);
      // setEmail(selectedPost.Email);
      setPhoneNumer(selectedPost.PhoneNumber);
      setPhoneCode(selectedPost.PhoneCode);
      setAreaOfApartment(selectedPost.AreaOfApartment);
      const date = new Date(selectedPost.StartDate);
      setDob(date.getDate());
      setMob(date.getMonth() + 1);
      setYob(date.getFullYear());
      setMinEstimatedBudget(selectedPost.MinEstimatedBudget);
      setMaxEstimatedBudget(selectedPost.MaxEstimatedBudget);
      setDescription(selectedPost.Description);
      setApartmentType(selectedPost.ApartmentType);
      if (!isNullOrUndefined(selectedPost.WeeksInMonth)) {
        const weeks = selectedPost.WeeksInMonth.split(',');
        setWeeksInMonth(weeks.map((w) => parseInt(w)));
      }
    }
  }, [selectedPost]);
  async function createPost(e) {
    e.preventDefault();
    let error = '';
    if (isNullOrUndefined(title)) {
      error += 'Please Insert Title!\n';
    }
    // if (isNullOrUndefined(email) || !validateEmail(email)) {
    //   error += 'Please Insert Email!\n';
    // }
    // if (isNullOrUndefined(phoneNumber)) {
    //   error += 'Please Insert Phone-Number!\n';
    // }
    if (weeksInMonth.length === 0) {
      error += 'Please choose weeks in a month!\n';
    }
    if (isNullOrUndefined(areaOfApartment)) {
      error += 'Please Insert Area of Apartment!\n';
    }
    const date = mob.toString() + '/' + dob.toString() + '/' + yob.toString();
    var dateFormat = 'MM/DD/YYYY';
    const dateConverted = moment(date).format(dateFormat);
    if (!moment(dateConverted, dateFormat, true).isValid()) {
      error += 'Please Insert a correct date\n';
    }
    if (isNullOrUndefined(minEstimatedBudget)) {
      error += 'Please Insert Min Estimated Budget!\n';
    }
    if (isNullOrUndefined(maxEstimatedBudget)) {
      error += 'Please Insert Max Estimated Budget!\n';
    }
    if (parseFloat(minEstimatedBudget) > parseFloat(maxEstimatedBudget)) {
      error += 'Please Insert Max Estimated Budget!\n';
    }
    if (!isNullOrUndefined(error)) {
      setErrors(error);
      setDisplayModal(true);
      return;
    }
    const userId = Cookies.get('userId');
    let weeks = '';
    weeksInMonth.forEach((element, i) => {
      if (i + 1 === weeksInMonth.length) weeks += element;
      else weeks += element + ',';
    });
    const body = {
      title,
      // email,
      phoneCode,
      phoneNumber,
      startDate: date,
      areaOfApartment,
      minEstimatedBudget,
      maxEstimatedBudget,
      apartmentType,
      weeks,
      description,
      id: selectedPost.ID,
    };
    const result = await rockFetchPost('/updateUserAd', body);
    if (result === null) {
      showSnackBar('Due to some error, Ad not updated!');
      return;
    }

    showSnackBar(
      'Votre annonce est en attente d???approbation et sera de nouveau en ligne bient??t!'
    );
    setSelectedPost(null);
  }
  function onWeekChange(week) {
    if (weeksInMonth.find((w) => w === week)) {
      const filteredWeeks = weeksInMonth.filter((w) => w !== week);
      setWeeksInMonth(filteredWeeks);
    } else {
      setWeeksInMonth([...weeksInMonth, week]);
    }
  }
  useEffect(() => {
    console.log(weeksInMonth);
  }, [weeksInMonth]);
  return (
    <div className='mainContainer margin-auto'>
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
        <div className='innerContainerChildSignUp' align='center'>
          <div className='row signUpFrom'>
            <div className='row signUpFromInner'>
              <div className='col-md-6'>
                <div className='row signUpFromInnerRow'>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-6'>
                      <div className='formTitle'>Titre de l???annonce</div>
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className='row signUpFromInnerRow'>
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
                        className='formTextField'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div> */}
                <div className='row signUpFromInnerRow'>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-6'>
                      <div className='formTitle'>Num??ro de t??l??phone</div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-12 text-align-left'>
                      <select
                        className='phoneCode'
                        name='phoneCode'
                        id='phoneCode'
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                      >
                        <option value='+33'>+33</option>
                        <option value='+92'>+92</option>
                        <option value='+91'>+91</option>
                        <option value='+50'>+50</option>
                      </select>
                      <input
                        type='email'
                        className='phoneTextField'
                        placeholder='6.XX.XX.XX.XX'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumer(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>
                          Ville et zone de recherche
                        </div>
                      </div>
                      <div className='col-md-6 man'>
                        <div className='formMandatory'>champ requis</div>
                      </div>
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12'>
                        <Autocomplete
                          id='auto-complete'
                          autoComplete
                          includeInputInList
                          options={zip_code}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField {...params} variant='standard' />
                          )}
                          value={areaOfApartment} 
                          filterOptions={filterOptions}
                          onChange={(e) =>
                            !isNullOrUndefined(e.target.value) &&
                            e.target.value.length > 100
                              ? null
                              : setAreaOfApartment(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='row signUpFromInnerRow'>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-6'>
                      <div className='formTitle'>Date de d??but</div>
                    </div>
                    <div className='col-md-6 man'>
                      <div className='formMandatory'>champ requis</div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-12 text-align-left flex align-items-center'>
                      <input
                        type='text'
                        className='dayAndMonth'
                        placeholder='dd'
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                      <input
                        type='text'
                        className='dayAndMonth'
                        placeholder='mm'
                        value={mob}
                        onChange={(e) => setMob(e.target.value)}
                      />
                      <input
                        type='text'
                        className='year'
                        placeholder='yy'
                        value={yob}
                        onChange={(e) => setYob(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className='row signUpFromInnerRow'>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-6'>
                      <div className='formTitle'>Semaines de chaque mois</div>
                    </div>
                    <div className='col-md-6 man'>
                      <div className='formMandatory'>champ requis</div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-7 text-align-left'>
                      <div
                        id='list1'
                        class='dropdown-check-list'
                        tabindex='100'
                      >
                        <span
                          class='anchor'
                          onClick={() =>
                            setCheckBoxesVisibility(!checkBoxesVisibility)
                          }
                        >
                          Select Week's
                        </span>
                        <ul
                          class='items'
                          style={{
                            display: checkBoxesVisibility ? 'block' : 'none',
                          }}
                        >
                          <li className='flex alignItemsCenter'>
                            <input
                              className='dropdown-checkbox'
                              disabled={
                                weeksInMonth.length === 3 &&
                                !weeksInMonth.find((w) => w === 1)
                              }
                              checked={weeksInMonth.find((w) => w === 1)}
                              type='checkbox'
                              onChange={() => onWeekChange(1)}
                            />
                            <div className='marginleft5'>Week-1</div>
                          </li>
                          <li className='flex alignItemsCenter'>
                            <input
                              className='dropdown-checkbox'
                              disabled={
                                weeksInMonth.length === 3 &&
                                !weeksInMonth.find((w) => w === 2)
                              }
                              checked={weeksInMonth.find((w) => w === 2)}
                              type='checkbox'
                              onChange={() => onWeekChange(2)}
                            />
                            <div className='marginleft5'>Week-2</div>
                          </li>
                          <li className='flex alignItemsCenter'>
                            <input
                              className='dropdown-checkbox'
                              disabled={
                                weeksInMonth.length === 3 &&
                                !weeksInMonth.find((w) => w === 3)
                              }
                              checked={weeksInMonth.find((w) => w === 3)}
                              type='checkbox'
                              onChange={() => onWeekChange(3)}
                            />
                            <div className='marginleft5'>Week-3</div>
                          </li>
                          <li className='flex alignItemsCenter'>
                            <input
                              className='dropdown-checkbox'
                              disabled={
                                weeksInMonth.length === 3 &&
                                !weeksInMonth.find((w) => w === 4)
                              }
                              checked={weeksInMonth.find((w) => w === 4)}
                              type='checkbox'
                              onChange={() => onWeekChange(4)}
                            />
                            <div className='marginleft5'>Week-4</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className='col-md-5 man'>
                      <div className='formMandatory'>
                        ( when you are NOT in your flat )
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row signUpFromInnerRow'>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-6'>
                      <div className='formTitle'>Budget mensuel</div>
                    </div>
                    <div className='col-md-6 man'>
                      <div className='formMandatory'>champ requis</div>
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='col-md-12 text-align-left flex align-items-center'>
                      <div className='formTitle'>de</div>{' '}
                      <input
                        type='number'
                        className='budgetMensuel'
                        placeholder='300'
                        value={minEstimatedBudget}
                        onChange={(e) => setMinEstimatedBudget(e.target.value)}
                      />
                      <div className='formTitle'>??</div>{' '}
                      <input
                        type='number'
                        className='budgetMensuel'
                        placeholder='400'
                        value={maxEstimatedBudget}
                        onChange={(e) => setMaxEstimatedBudget(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='row signUpFromInnerRow'>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-6'>
                        <div className='formTitle'>Apartment type</div>
                      </div>
                      <div className='col-md-6 man'>
                        <div className='formMandatory'>champ requis</div>
                      </div>
                    </div>
                    <div className='row signUpFromInnerRow'>
                      <div className='col-md-12 text-align-left'>
                        <select
                          className='Apartment_type'
                          name='Apartment_type'
                          id='Apartment_type'
                          value={apartmentType}
                          onChange={(e) => setApartmentType(e.target.value)}
                        >
                          <option value='sharedflat'>
                            Room In A Shared Flat
                          </option>
                          <option value='studio'>Studio</option>
                          <option value='t1'>T1</option>
                          <option value='t2+'>T2+</option>
                        </select>
                      </div>
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
              </div>
              <div className='col-md-12'>
                <button className='submitButton' onClick={createPost}>
                  Update Ad
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditPost;
