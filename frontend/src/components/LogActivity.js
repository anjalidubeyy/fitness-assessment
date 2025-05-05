const sleepQualityOptions = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Very Good' },
  { value: 5, label: 'Excellent' }
];

{formData.type === 'sleep' && (
  <>
    <div className="form-group">
      <label htmlFor="sleepDuration">Sleep Duration (hours)</label>
      <input
        type="number"
        id="sleepDuration"
        name="sleepDuration"
        min="0"
        max="24"
        step="0.5"
        value={formData.sleepDuration}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="sleepQuality">Sleep Quality</label>
      <select
        id="sleepQuality"
        name="sleepQuality"
        value={formData.sleepQuality}
        onChange={handleChange}
        required
      >
        <option value="">Select sleep quality</option>
        {sleepQualityOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </>
)} 