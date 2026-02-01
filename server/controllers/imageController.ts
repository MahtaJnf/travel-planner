export const getImages = async (req, res) => {
  const city = req.query.city;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!city || !accessKey) {
    return res
      .status(400)
      .json({ error: 'Missing city or Unsplash access key' });
  }

  try {
    const query = `cities ${city}`;
    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=10&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    const data = await unsplashRes.json();
    const images = data.results?.map((img) => img.urls?.regular) || [];

    if (!images.length) {
      return res.status(404).json({ error: 'No images found for that city' });
    }

    return res.status(200).json({ images });
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export const getTouristImages = async (req, res) => {
  const city = req.query.city;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!city || !accessKey) {
    return res
      .status(400)
      .json({ error: 'Missing city or Unsplash access key' });
  }

  try {
    const query = `tourists ${city}`;

    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=10&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );
    if (!unsplashRes.ok) {
      const text = await unsplashRes.text();
      console.error('Unsplash error:', unsplashRes.status, text);
      return res
        .status(unsplashRes.status)
        .json({ error: 'Unsplash API limit reached or error occurred' });
    }
    const data = await unsplashRes.json();
    const touristImages = data.results?.map((img) => img.urls?.regular) || [];
    if (!touristImages.length) {
      return res.status(404).json({ error: 'No images found for that city' });
    }
    return res.status(200).json({ touristImages });
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
};
