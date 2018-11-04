import React from 'react';
import ReactDOM from 'react-dom';
import tinycolor from 'tinycolor2'
import axios from 'axios';
import SunCalc  from 'suncalc';
import keys from './keys.js';
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

const humidityControl = {
  'title': 'Humidity',
  'name': 'humidity',
  'min': '0',
  'max': '100',
  'step': '1',
  'unit': String.fromCharCode(37)
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




/*
 * Controls
 */
class Range extends React.Component {
  constructor(props) {
    super(props);
    this.updateRange = this.updateRange.bind(this);
  }
  
  updateRange(e) {
    this.props.updateRange(e.target.value);
  }
  
  render() {
    const label = this.props.settings.options  ? this.props.settings.options[this.props.range] : this.props.range;
    const unit = "unit" in this.props.settings ? this.props.settings.unit : '';
    const footer = this.props.isDisabled ? <p className="range__footer">Turn off rain to reduce humidity</p> : null;

    return (
      <div className="control">
        <div className="range__label-wrap">
          <label className="range__label" htmlFor={this.props.settings.name}>{this.props.settings.title}</label>
          <span className="range__number">{label}{unit}</span>
        </div>
        <input className="range__input" id="range" type="range" disabled={this.props.isDisabled} name={this.props.settings.name}
          value={this.props.range}
          min={this.props.settings.min}
          max={this.props.settings.max}
          step={this.props.settings.step}
          onChange={this.updateRange}
        />
        { footer }
      </div>
    )
  }
}


function ButtonGroup(props) {
  const buttons = props.options.map((item, i) => {
    const activeClass = props.activeButtons.includes(item.value) ? 'is-active' : '';
    const classNames = activeClass + ' button';
    return (
      <button className={classNames} key={i} onClick={() => props.handleChange(item.value)}>
      {item.label}
      </button>
    );
  });

  return <div className="control button-group">{buttons}</div>;
}


function ToggleButton(props) {
  const buttons = props.options.map((item) => {
      const activeClass = props.isActive === item.value ? 'is-active' : '';
      const classNames = activeClass + ' button';
      return (
        <button className={classNames} key={item.slug} onClick={() => props.handleChange(item.value)}>{item.label}</button>
      );
  });

  return <div className="control toggle-button">{buttons}</div>
}





/*
 * Initial Setup
 */
function getLocation() {
  if ("geolocation" in navigator) {
    return new Promise(
      (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)
    )
  } else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser');
    return false;
  }
}


function getBackupLocation() {
  return axios.get("https://ipapi.co/json/");
}


function getWeather(location) {
  let units = "&units=imperial";
  let appid = "&APPID=" + keys.openWeatherMap;
  
  return axios.get("https://api.openweathermap.org/data/2.5/weather?" + location + units + appid);
}


function latLngString(lat, lng) {
  return 'lat=' + lat + '&lon=' + lng;
}




/*
 * Output
 */
function Background(props) {
  const styles = { backgroundColor: tinycolor(props.color).toString() };
  return (
    <div className="background" style={styles}></div>
  )
}


function BackgroundControls(props) {
  const color = tinycolor(props.color).toString();
  const gradient = 'linear-gradient(to right, rgba(255,0,0,0), ' + color + ')';
  const stylesDesktop = { backgroundImage: gradient };
  const stylesMobile = { backgroundColor: color };

  return (
      <div className="controls__background">
        <div className="controls__background-inner controls__background--mobile" style={stylesMobile}></div>
        <div className="controls__background-inner controls__background--desktop" style={stylesDesktop}></div>
      </div>
  );
}


function Night(props) {
  let styles = null;
  if (!props.isNight) { styles = { display: 'none' }; }
  return (
    <div className="night" style={styles}></div>
  )
}


/*
 * Phase:
 * 0 - New Moon
 * 0.25 - First Quarter
 * 0.5 - Full Moon
 * 0.75 - Last Quarter
 */
function Moon(props) {

  let humidity = (props.humidity - 25) / 6.5;
  humidity = humidity < 0 ? 0 : humidity;

  const phase = parseFloat(props.phase);

  const earthOrMoonGradient = phase < 0.25 || phase > 0.75 ? 'earth' : 'moon';
  const earthBackgroundCSS = earthOrMoonGradient === 'earth' ? 'backgroundImage' : 'backgroundColor';
  const moonBackgroundCSS = earthOrMoonGradient === 'moon' ? 'backgroundImage' : 'backgroundColor';

  const percentages = getMoonGradientPercentages(phase);
  const white = 'rgba(255,255,255,1)';
  const transparent = 'rgba(255,255,255,0)';
  const color = earthOrMoonGradient === 'earth' ? tinycolor(props.color).toString() : white;

  const gradient = 'radial-gradient(circle at ' + toPercentString(percentages[0]) + ', ' + color + ' ' + toPercentString(percentages[1]) + ', ' + transparent + ' ' + toPercentString(percentages[2]) + ')';

  let moonStyles = {};
  moonStyles[moonBackgroundCSS] = earthOrMoonGradient === 'moon' ? gradient : white;

  let earthStyles = {};
  earthStyles[earthBackgroundCSS] = earthOrMoonGradient === 'earth' ? gradient : 'none';
  earthStyles['display'] = earthOrMoonGradient === 'earth' ? 'block' : 'none';

  const wrapperStyles = {
    'filter': 'blur(' + humidity + 'px)'
  };

  return (
    <div className="moon-earth-wrapper" style={wrapperStyles}>
      <div className="moon" style={moonStyles}></div>
      <div className="earth" style={earthStyles}></div>
    </div>
  )
}


function Condition(props) {
  const precips = props.types.filter(n => (['snowy', 'rainy'].indexOf(n) !== -1));
  const isCloudy = props.types.includes('cloudy');

  return (
    <div>
      <Clouds isCloudy={isCloudy} />
      <Precipitation types={precips} color={props.color} />
    </div>
  )
}


function Precipitation(props) {
  const backgroundColor = tinycolor(props.color).spin(180);
  const css = `
    .precipitation .rainy {
      background-color: ${backgroundColor};
    }`;

  return props.types.map(function(precipType) {
    return (
      <div className="precipitation">
        <style>{css}</style>
        <PrecipitationItem types={props.types} precipType={precipType} />
      </div> 
    );
  });
}


class PrecipitationItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !arraysMatch(nextProps.types, this.props.types);
  }
  render() {
    const precipType = this.props.precipType;
    return Array(30).fill(1).map((el, i) => {
      const sizeCSS = getRandomInt(2, 14) + 'vh';
      const topCSS = getRandomInt(0, 100) + 'vh';
      const leftCSS = getRandomInt(0, 100) + 'vw';
      const styles = {
        width: sizeCSS,
        height: sizeCSS,
        top: topCSS,
        left: leftCSS,
      };
      return <div class={precipType} style={styles} value={i}></div>
    });
  }
}


function Clouds(props) {
  if (props.isCloudy) { return <div className="clouds"></div> }
  else { return null; }
}


/*
function Lightning(props) {
  if (props.isLightning) {
    return (
      <div className="lightning">
        <div className="lightning-strike lightning-strike-1"></div>
        <div className="lightning-strike lightning-strike-2"></div>
      </div>
    )
  } else { return null; }
}
*/


function ControlsControl(props) {
  return (
    <button className="controls__control" onClick={() => props.handleChange(!props.isClosed)}>
      <ControlsIcon isClosed={props.isClosed} /><span className="controls__text">Controls</span>
    </button>
  );
}

function ControlsIcon(props) {
  const isClosed = props.isClosed;
  if (isClosed) {
    return <IconCirclePlus />;
  } else {
    return <IconCircleMinus />;
  }
}


function IconCirclePlus() {
  return (
    <svg className="controls__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle className="icon__main" cx="32" cy="32" r="29"/><path className="icon__accent icon--stroke" fill="none" stroke="#FFF" strokeMiterlimit="10" d="M20 32h24"/><path className="icon__accent icon--stroke" stroke="#FFF" strokeMiterlimit="10" d="M32 20v24"/></svg>
  );
}


function IconCircleMinus() {
  return (
    <svg className="controls__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle className="icon__main" cx="32" cy="32" r="29"/><path className="icon__accent icon--stroke" fill="none" stroke="#FFF" strokeMiterlimit="10" d="M20 32h24"/></svg>
  );
}





/*
 * Helper Functions
 */
function arraysMatch(array1, array2) {
  return array1.sort().join(',') === array2.sort().join(',');
}


function toPercentString(num) {
  return num.toString() + '%';
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function isEven(num) {
  return num % 2 === 0;
}


function getMoonGradientPercentages(phase) {
  let percent0 = 0;
  let percent1 = 0;
  let percent2 = 0;


  if (phase >= 0.25 && phase <= 0.5) {
    percent0 = 50 + ( (50 - (phase * 100)) * 2 );
    percent1 = 0;
    percent2 = 100;

  } else if (phase > 0.5 && phase <= 0.75) {
    percent0 = 50 - ( ((phase * 100) - 50) * 2);
    percent1 = 0;
    percent2 = 100;

  } else if (phase < 0.25) {
    percent0 = 0;
    percent1 = (25 - (phase * 100)) * 4;
    percent2 = 100;

  } else if (phase > 0.75) {
    percent0 = 100;
    percent1 = ((phase * 100) - 75) * 4;
    percent2 = 100;
  }

  return [percent0, percent1, percent2];
}


/*
 * Magenta: rgb(255, 0, 255) _________ 100, Section 0
 * B -
 * Red: rgb(255, 0, 0) _______________ 85, Section 1
 * G +
 * Yellow: rgb(255, 255, 0) __________ 70, Section 2
 * R -
 * Green: rgb(0, 255, 0) _____________ 55, Section 3
 * B +
 * Turquoise: rgb(0, 255, 255) _______ 40, Section 4
 * G -
 * Blue/Indigo: rgb(0, 0, 255) _______ 25, Section 5
 * R +
 */
function getColorByTemp(temp) {
  // split temp in 15 increments
  var tempSpan = 15;
  // hotest color = magenta
  var color = {
    r: 255,
    g: 0,
    b: 255
  };

  var colorMap = ['b', 'g', 'r', 'b', 'g'];
  var colorSection = Math.ceil( (100 - temp) / tempSpan );

  for (var i = 1; i <= colorSection; i++) {
    // if super cold, less than 100 - (tempSpan * 5)
    if (colorSection > 5) { color = {r:0, g:0, b:255}; break; }

    // alternate between adding and subtracting RGB values
    const isAdd = isEven(i);

    // element that is getting changed
    const RGorB = colorMap[i - 1];

    // check if this is the last loop
    const isLast = i === colorSection;
    const remander = (100 - temp) % tempSpan;
    const num = isLast && remander !== 0 ? (255 * remander) / tempSpan : 255;

    // if even, add to element
    // if odd, subtract
    if (isAdd) {
      color[RGorB] = color[RGorB] + num;
    } else {
      color[RGorB] = color[RGorB] - num;
    }
  }

  return color;

}


function getInitialMoonPhaseValue(moonPhase) {
  const moonPhasesStatic = [0.5, 0.75, 1, 0, 0.25];
  if (moonPhasesStatic.includes(moonPhase)) { return moonPhase; }

  if (moonPhase > 0 && moonPhase < 0.25) { return 0.125; }
  if (moonPhase > 0.25 && moonPhase < 0.5) { return 0.375; }
  if (moonPhase > 0.5 && moonPhase < 0.75) { return 0.625; }
  if (moonPhase > 0.75 && moonPhase < 1) { return 0.875; }

}


class Body extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isNight: false,
      selectedConditions: [],
      rangeMoonPhase: 0,
      rangeHumidityVal: 0,
      location: '',
      weather: '',
      temp: '',
      isControlsClosed: true
    };
    this.handleChangeControls = this.handleChangeControls.bind(this);
    this.handleChangeMoonRange = this.handleChangeMoonRange.bind(this);
    this.handleChangeHumidityRange = this.handleChangeHumidityRange.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeCondition = this.handleChangeCondition.bind(this);
    this.handleChangeTemperatureRange = this.handleChangeTemperatureRange.bind(this);
    this.setInitialWeatherState = this.setInitialWeatherState.bind(this);
  }

  componentDidMount() { 
    let _this = this;
    getLocation()
      .then(_this.setInitialWeatherState)
      .catch(
        getBackupLocation().then(_this.setInitialWeatherState)
      );
  }

  setInitialWeatherState(result) {
    let _this = this;
    let date = new Date();
    let dateStamp = date.getTime();
    let moonPhase = SunCalc.getMoonIllumination(date).phase;

    _this.setState({ rangeMoonPhase: getInitialMoonPhaseValue(moonPhase) });

    const lat = "coords" in result ? result.coords.latitude : result.data.latitude;
    const lng = "coords" in result ? result.coords.longitude : result.data.longitude;
    const loc = latLngString(lat, lng);

    getWeather(loc)
      .then(function(result) {
        let conditions = [];
        let isNight = true;
        if ( "rain" in result.data ) { conditions.push('rainy'); }
        if ( "snow" in result.data ) { conditions.push('snowy'); }
        if ( ("clouds" in result.data) && result.data.clouds.all > 0) { conditions.push('cloudy'); }
        if (result.data.sys.sunrise < dateStamp && result.data.sys.sunset > dateStamp) { isNight = false; }
        _this.setState({
          location: loc,
          weather: result.data,
          temp: result.data.main.temp,
          rangeHumidityVal: result.data.main.humidity,
          selectedConditions: conditions,
          isNight: isNight
        })
      })
      .catch(function() {
        _this.setState({ temp: 100 });
      });
      
  }

  handleChangeControls(isControlsClosed) {
    this.setState({ isControlsClosed: isControlsClosed });
  }

  handleChangeTemperatureRange(val) {
    this.setState({ temp: val });
  }

  handleChangeMoonRange(val) {
    this.setState({ rangeMoonPhase: val });
  }

  handleChangeHumidityRange(val) {
    this.setState({ rangeHumidityVal: val });
  }

  handleChangeTime(isNight) {
    this.setState({ isNight: isNight });
  }

  handleChangeCondition(selectedCondition) {
    this.setState(function(prevState) {
      let output = null;
      // toggle functionality
      if (prevState.selectedConditions.includes(selectedCondition)) {
       output = prevState.selectedConditions.filter(item => item !== selectedCondition);
      } else {
        output = [...prevState.selectedConditions, selectedCondition];
      }
      return {
        selectedConditions: output
      };
    });
  }




  render() {
    const { temp } = this.state;
    const { rangeMoonPhase } = this.state;
    const isRainy = this.state.selectedConditions.includes('rainy');
    const rangeHumidityVal = isRainy ? 100 : this.state.rangeHumidityVal;
    const controlsStyle = this.state.isControlsClosed ? {display:'none'} : {display: 'block'};

    const color = getColorByTemp(this.state.temp);
    const isColorDark = tinycolor(color).isDark();
    const contentColor = isColorDark ? 'white' : 'black';
    const contentStyle = { 'color': contentColor };

    let contentClasses = this.state.isControlsClosed ? 'is-closed-controls' : 'is-open-controls';
    contentClasses += isColorDark ? ' is-dark-color' : ' is-light-color';
    contentClasses += temp === '' ? ' is-loading' : '';


    return (
      <div className={'content ' + contentClasses} style={contentStyle}>
        <Background color={color} />
        <BackgroundControls color={color} />

        <div className="controls">
          <ControlsControl 
            handleChange={this.handleChangeControls}
            isClosed={this.state.isControlsClosed}
          />
          <div className="controls__content" style={controlsStyle}>
            <p className="control">Initial results are based on your current weather and conditions. Change the controls below to create a new image.</p>
            <Range
              range={temp}
              updateRange={this.handleChangeTemperatureRange}
              settings={temperatureControl}
              isDisabled={false}
            />
            <Range
              range={rangeMoonPhase}
              updateRange={this.handleChangeMoonRange}
              settings={moonPhaseControl}
              isDisabled={false}
            />
            <Range 
              range={rangeHumidityVal}
              updateRange={this.handleChangeHumidityRange}
              settings={humidityControl}
              isDisabled={isRainy}
            />
            <ButtonGroup
              options={conditionOptions}
              handleChange={this.handleChangeCondition}
              activeButtons={this.state.selectedConditions}
            />
            <ToggleButton
              isActive={this.state.isNight}
              handleChange={this.handleChangeTime}
              options={timeOptions}
            />
          </div>
        </div>

        <Night isNight={this.state.isNight} />
        <Moon
          phase={rangeMoonPhase}
          color={color}
          humidity={rangeHumidityVal}
        />
        <Condition
          types={this.state.selectedConditions}
          color={color}
        />
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Body />,
  document.getElementById('root')
);
