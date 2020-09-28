import React, { useState } from 'react';
import axios from 'axios';
import { withFormik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {
  logoUpload,
  colorUpload,
  deleteSellerInfo,
  postOnboard,
  profileUpdate,
} from '../state/actionCreators';
import { TwitterPicker } from 'react-color';
import history from '../history';

const Update = (props) => {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(props.color.color);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const uploadImage = (e) => {
    const files = e.target.files;
    setLoading(true);
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'shopping-cart-logo');
    axios
      .post('https://api.cloudinary.com/v1_1/dnsl4nbz4/image/upload', data)
      .then((res) => {
        props.logoUpload(res.data.secure_url);
      });
    setLoading(false);
  };

  return (
    <div className='profileWrapper' data-testid='updateProfileWrapper'>
      <h1 className='profileHeader' data-testid='updateProfileMainHeader' >Profile</h1>
      <div className='imageColorWrapper' data-testid='updateProfileSecondaryWrapper'>
        <div className='image-color' data-testid='updateProfileColorWrappers'>
          <div className='logoDiv' data-testid='updateProfileLogoWrappers'>
            <label className='logoChangeButton' htmlFor='uploadButton'>
              Change logo
            </label>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <img
                style={{ height: '100px' }}
                alt='logo'
                src={props.logo.logo}
              />
            )}
            <input  data-testid='updateUploadImageButton' id='uploadButton' type='file' onChange={uploadImage} />
          </div>
          <div className='colorDiv' >
            <h3 className='colorHeader'>Brand Color</h3>

            <TwitterPicker
              className='twitterPicker'
              color={color}
              onChangeComplete={(color) => {
                setColor(color.hex);
                props.colorUpload(color.hex);
              }}
            />
            <div
              style={{
                margin: '1rem',
                backgroundColor: props.color.color,
                height: '50px',
                width: '50%',
                transition: 'ease all 500ms',
              }}></div>
          </div>
        </div>
        <Form className='profileForm' >
          <div className='formTop' data-testid='updateProfileTopDiv'>
            <div className='formTopLeft' data-testid='updateProfileLeftDiv'>
            <label htmlFor='business name'data-testid='updateProfileBusName' >Business Name*</label>
              <br />
              <Field
                name='businessName'
                type='text'
                value={props.values.businessName}
                placeholder={props.address}
                className='formInputFields'
              />
              {props.touched.businessName && props.errors.businessName && (
                <p className='formErrorHandling'>enter, please</p>
              )}
              <br />
              <label htmlFor='owner name' data-testid='updateProfileOwnerName'>Owner Name*</label>
              <br />
              <Field
                name='ownerName'
                type='text'
                value={props.values.ownerName}
                placeholder={props.ownerName}
                className='formInputFields'
              />
              {props.touched.ownerName && props.errors.ownerName && (
                <p className='formErrorHandling'>enter, please</p>
              )}
              <br />
              <label htmlFor='address'>Address*</label>
              <br />
              <Field
                name='address'
                type='text'
                value={props.values.address}
                placeholder={props.address}
                className='formInputFields'
              />
              {props.touched.address && props.errors.address && (
                <p className='formErrorHandling'>address, please</p>
              )}
              <br />
              <label htmlFor='owner name'>Second Address</label>
              <br />
              <Field
                name='secondAddress'
                type='text'
                value={props.values.secondAddress}
                placeholder={props.secondAddress}
                className='formInputFields'
              />
              {props.touched.secondAddress && props.errors.secondAddress && (
                <p className='formErrorHandling'>enter if needed</p>
              )}
            </div>
            <div className='formTopRight'>
              <label htmlFor='city'>City*</label>
              <br />
              <Field
                name='city'
                type='text'
                value={props.values.city}
                placeholder={props.city}
                className='formInputFields'
              />
              {props.touched.city && props.errors.city && (
                <p className='formErrorHandling'>City required</p>
              )}
              <br />
              <label htmlFor='state'>State*</label>
              <br />
              <Field
                name='state'
                type='text'
                value={props.values.state}
                placeholder={props.state}
                className='formInputFields'
              />
              {props.touched.state && props.errors.state && (
                <p className='formErrorHandling'>enter State</p>
              )}
              <br />
              <label htmlFor='zip code'>Zip Code*</label>
              <br />
              <Field
                name='zipcode'
                type='number'
                maxLength={5}
                placeholder={props.zipcode}
                value={props.values.zipcode}
                className='formInputFields'
              />
              <ErrorMessage name='zipcode'>
                {(msg) => <div className='formErrorHandling'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>
          <label htmlFor='store hours'>Store Hours*</label>
          <br />
          <Field
            name='hours'
            type='text'
            value={props.values.hours}
            placeholder={props.hours}
            className='formInputFields'
          />
          {props.touched.hours && props.errors.hours && (
            <p className='formErrorHandling'>enter Hours of Operation</p>
          )}
          <br />
          <label htmlFor='curbside hours'>Curbside Pickup Hours</label>
          <br />
          <Field
            name='curbHours'
            type='text'
            value={props.values.curbHours}
            placeholder={props.curbHours}
            className='formInputFields'
          />
          {props.touched.curbHours && props.errors.curbHours && (
            <p className='formErrorHandling'>enter Curbside hours</p>
          )}
          <br />
          <div className='buttonDiv'>
            <button className='updateProfileButton' type='submit'>
              Update Profile
            </button>
            <p className={confirmDelete ? 'showMe' : 'hidden'}>
              Are you sure you want to delete your store information?
            </p>
            <p className={confirmLogout ? 'showMe' : 'hidden'}>
              Are you sure you want to logout?
            </p>
            <div className='logoutDelete'>
              <button
                className={
                  confirmLogout || confirmDelete ? 'hidden' : 'showMeLogout'
                }
                onClick={() => {
                  setConfirmLogout(true);
                }}>
                Logout
              </button>
              <button
                className={confirmLogout ? 'showMe' : 'hidden'}
                onClick={() => {
                  localStorage.clear();
                  history.push('/');
                }}>
                Confirm Logout
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(!confirmDelete);
                }}
                className={!confirmDelete ? 'hidden' : 'showMe'}>
                Don't delete my store!
              </button>
              <button
                onClick={() => {
                  setConfirmLogout(!confirmLogout);
                }}
                className={!confirmLogout ? 'hidden' : 'showMe'}>
                Don't log me out!
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(true);
                }}
                className={
                  confirmDelete || confirmLogout ? 'hidden' : 'showMe'
                }>
                Delete Store
              </button>
              <button
                className={confirmDelete ? 'showMe' : 'hidden'}
                onClick={(values) => {
                  props.deleteSellerInfo(values);
                  history.push('/welcome');
                }}>
                Confirm Deletion
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

const ProfileUpdater = withFormik({
  mapPropsToValues({
    businessName,
    ownerName,
    address,
    secondAddress,
    city,
    state,
    zipcode,
    hours,
    curbHours,
  }) {
    return {
      businessName: businessName || '',
      ownerName: ownerName || '',
      address: address || '',
      secondAddress: secondAddress || '',
      city: city || '',
      state: state || '',
      zipcode: zipcode || '',
      hours: hours || '',
      curbHours: curbHours || '',
    };
  },

  validationSchema: Yup.object().shape({
    businessName: Yup.string().required('Enter your business name!'),
    ownerName: Yup.string().required('Enter your name!'),
    address: Yup.string().required('Enter your address!'),
    secondAddress: Yup.string(),
    city: Yup.string().required('Enter your city!'),
    state: Yup.string().required('Enter your state!'),
    zipcode: Yup.string()
      .max(5, '5 digits only!')
      .min(5, 'must be 5 digits')
      .required('Enter your Zip Code!'),

    hours: Yup.string().required('Enter your store hours!'),
    curbHours: Yup.string(),
  }),

  handleSubmit: (values, formikBag) => {
    formikBag.props.profileUpdate(values);
    history.push('/dashboard');
  },
})(Update);

const mapStateToProps = (state) => {
  return {
    businessName: state.onboard.businessName,
    ownerName: state.onboard.ownerName,
    address: state.onboard.address,
    secondAddress: state.onboard.secondAddress,
    city: state.onboard.city,
    state: state.onboard.state,
    zipcode: state.onboard.zipcode,
    hours: state.onboard.hours,
    curbHours: state.onboard.curbHours,
    logo: state.logo,
    color: state.color,
  };
};

export default connect(mapStateToProps, {
  logoUpload,
  colorUpload,
  deleteSellerInfo,
  postOnboard,
  profileUpdate,
})(ProfileUpdater);
