import React from 'react';
import { ERoute } from './ERoute';

export default function Footer({setRoute}:any) {
  return (
    <footer className='page-footer font-small blue pt-4'>
      <div className='container-fluid text-center text-md-left'>
        <div className='row'>
          {/* <div className='col-md-3 mt-md-0 mt-3'>
            <h5 className='text-uppercase'>Overloc</h5>
          </div> */}
          <hr className='clearfix w-100 d-md-none pb-3' />
          {/* <div class='col-md-3 mb-md-0 mb-3'>
          <h5 class='text-uppercase'>Links</h5>
          <ul class='list-unstyled'>
            <li>
              <a href='#!'>Link 1</a>
            </li>
            <li>
              <a href='#!'>Link 2</a>
            </li>
            <li>
              <a href='#!'>Link 3</a>
            </li>
            <li>
              <a href='#!'>Link 4</a>
            </li>
          </ul>
        </div> */}
          {/* <div className='col-md-3 mb-md-0 mb-3'>
            <h5 className='text-uppercase'>Links</h5>
            <ul className='list-unstyled'>
              <li>
                <a href='#!'>Link 1</a>
              </li>
              <li>
                <a href='#!'>Link 2</a>
              </li>
              <li>
                <a href='#!'>Link 3</a>
              </li>
              <li>
                <a href='#!'>Link 4</a>
              </li>
            </ul>
          </div> */}
          <div className='col-md-4 mb-md-0 mb-3'>
            <h5 className='text-uppercase textAlignCenter on-link-hover' onClick={() => setRoute(ERoute.ConditionGenerales)}>
              Conditions générales d’utilisation
            </h5>
          </div>
          <div className='col-md-4 mb-md-0 mb-3'>
            <h5 className='text-uppercase textAlignCenter on-link-hover' onClick={() => setRoute(ERoute.QuiSommes)}>
              Qui sommes-nous ?
            </h5>
          </div>
          <div className='col-md-4 mb-md-0 mb-3'>
            <h5 className='text-uppercase textAlignCenter on-link-hover' onClick={() => setRoute(ERoute.Contracter)}>
              Nous contacter
            </h5>
          </div>
        </div>
      </div>
      <div className='footer-copyright text-center py-3'>
        © 2022 Copyright -<a> Overloc</a>
      </div>
    </footer>
  );
}
