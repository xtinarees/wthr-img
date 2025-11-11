import React from 'react';

const Range = ({ range, updateRange, settings }) => {
  const label = settings.options ? settings.options[range] : range;
  const unit = "unit" in settings ? settings.unit : '';

  return (
    <div className="control">
      <div className="range__label-wrap">
        <label className="range__label" htmlFor={settings.name}>{settings.title}</label>
        <span className="range__number">{label}{unit}</span>
      </div>
      <input className="range__input" id="range" type="range" name={settings.name}
        value={range}
        min={settings.min}
        max={settings.max}
        step={settings.step}
        onChange={e => updateRange(e.target.value)}
      />
    </div>
  );
};

export default Range;
