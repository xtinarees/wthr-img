import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import tinycolor from 'tinycolor2'
import SunCalc  from 'suncalc';
import { getLocation, getBackupLocation, getWeather, latLngString } from './setup.jsx';
import { 
  getColor,
  getInitialMoonPhaseValue, 
} from './utils.jsx';
import Background from "./components/Background.jsx";
import Range from "./components/Range.jsx";
import ButtonGroup from "./components/ButtonGroup.jsx";
import ToggleButton from "./components/ToggleButton.jsx";
import BackgroundControls from "./components/BackgroundControls.jsx";
import Moon from "./components/Moon.jsx";
import Condition from "./components/Condition.jsx";
import ControlsControl from "./components/ControlsControl.jsx";
import './index.css';


/*
 * Set Global Constants
 */
const moonPhaseControl = {
  'title': 'Moon Phase',
  'name': 'moonRange',
  'min': '0',
  'max': '1',
  'step': '0.125',
  'options' : {
    '0.5': 'Full',
    '0.625': 'Waning Gibbus',
    '0.75': 'Third Quarter',
    '0.875': 'Waning Crescent',
    '1': 'New',
    '0': 'New',
    '0.125': 'Waxing Crescent',
    '0.25': 'First Quarter',
    '0.375': 'Waxing Gibbus'
  }
};

const temperatureControl = {
  'title': 'Temperature',
  'name': 'temperatureRange',
  'min': '20',
  'max': '100',
  'step': '1',
  'unit': String.fromCharCode(176) + 'F'
}

const timeOptions = [
  { value: false, label: 'Day', slug: 'day' },
  { value: true, label: 'Night', slug: 'night' }
];

const conditionOptions = [
  { value: 'cloudy', label: 'Cloudy' },
  { value: 'rainy', label: 'Rainy' },
  { value: 'snowy', label: 'Snowy' }
];

function Body() {
  const [isNight, setIsNight] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [rangeMoonPhase, setRangeMoonPhase] = useState(0);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const [temp, setTemp] = useState('');
  const [isControlsClosed, setIsControlsClosed] = useState(true);

  useEffect(() => {
    let isMounted = true;
    function setInitialWeatherState(result) {
      let date = new Date();
      let dateStamp = Math.floor(date.getTime()/1000);
      let moonPhase = SunCalc.getMoonIllumination(date).phase;
      if (isMounted) setRangeMoonPhase(getInitialMoonPhaseValue(moonPhase));
      const lat = "coords" in result ? result.coords.latitude : result.data.latitude;
      const lng = "coords" in result ? result.coords.longitude : result.data.longitude;
      const loc = latLngString(lat, lng);
      getWeather(loc)
        .then(function(result) {
          let conditions = [];
          let night = true;
          if ( "rain" in result.data ) { conditions.push('rainy'); }
          if ( "snow" in result.data ) { conditions.push('snowy'); }
          if ( ("clouds" in result.data) && result.data.clouds.all > 0) { conditions.push('cloudy'); }
          if (result.data.sys.sunrise < dateStamp && result.data.sys.sunset > dateStamp) { night = false; }
          if (isMounted) {
            setLocation(loc);
            setWeather(result.data);
            setTemp(result.data.main.temp);
            setSelectedConditions(conditions);
            setIsNight(night);
          }
        })
        .catch(function() {
          if (isMounted) setTemp(100);
        });
    }
    getLocation()
      .then(setInitialWeatherState)
      .catch(() => {
        getBackupLocation().then(setInitialWeatherState);
      });
    return () => { isMounted = false; };
  }, []);

  const handleChangeControls = (closed) => {
    setIsControlsClosed(closed);
  };
  const handleChangeTemperatureRange = (val) => {
    setTemp(val);
  };
  const handleChangeMoonRange = (val) => {
    setRangeMoonPhase(val);
  }
  const handleChangeTime = (val) => {
    setIsNight(val);
  };
  
  const handleChangeCondition = (selectedCondition) => {
    setSelectedConditions(prev => {
      if (prev.includes(selectedCondition)) {
        return prev.filter(item => item !== selectedCondition);
      } else {
        return [...prev, selectedCondition];
      }
    });
  };


  const controlsStyle = isControlsClosed ? {display:'none'} : {display: 'block'};
  const mainColor = getColor(temp, isNight);
  const isColorDark = tinycolor(mainColor).isDark();
  const contentColor = isColorDark ? 'white' : 'black';
  const contentStyle = { color: contentColor };
  let contentClasses = isControlsClosed ? 'is-closed-controls' : 'is-open-controls';
  contentClasses += isColorDark ? ' is-dark-color' : ' is-light-color';
  contentClasses += temp === '' ? ' is-loading' : '';

  return (
    <div className={'content ' + contentClasses} style={contentStyle}>
      <Background color={mainColor} />
      <BackgroundControls color={mainColor} />
      <div className="controls">
        <ControlsControl 
          handleChange={handleChangeControls}
          isClosed={isControlsClosed}
        />
        <div className="controls__content" style={controlsStyle}>
          <p className="control">Initial results are based on your current weather and conditions. Change the controls below to create a new image.</p>
          <Range
            range={temp}
            updateRange={handleChangeTemperatureRange}
            settings={temperatureControl}
          />
          <Range
            range={rangeMoonPhase}
            updateRange={handleChangeMoonRange}
            settings={moonPhaseControl}
          />
          <ButtonGroup
            options={conditionOptions}
            handleChange={handleChangeCondition}
            activeButtons={selectedConditions}
          />
          <ToggleButton
            isActive={isNight}
            handleChange={handleChangeTime}
            options={timeOptions}
          />
        </div>
      </div>
      <Moon
        phase={rangeMoonPhase}
        color={mainColor}
      />
      <Condition
        types={selectedConditions}
        color={mainColor}
      />
    </div>
  );
}

export default Body;