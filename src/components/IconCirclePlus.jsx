import React from 'react';

const IconCirclePlus = () => (
  <svg className="controls__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle className="icon__main" cx="32" cy="32" r="29"/>
    <path className="icon__accent icon--stroke" fill="none" stroke="#FFF" strokeMiterlimit="10" d="M20 32h24"/>
    <path className="icon__accent icon--stroke" stroke="#FFF" strokeMiterlimit="10" d="M32 20v24"/>
  </svg>
);

export default IconCirclePlus;
