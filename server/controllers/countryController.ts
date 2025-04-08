import axios from 'axios';

export const getCountryData = async (req, res, next) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: 'Country code is required' });
  }
  try {
    const url = `https://restcountries.com/v3.1/alpha/${code}`;
    const { data } = await axios.get(url);

    const country = data?.[0];
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.error('Error fetching country data:', error.message);
    return res.status(500).json({ error: 'Failed to fetch country data' });
  }
};
