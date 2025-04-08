export const getIntroImage = async (req, res) => {
  const city = req.query.city;
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!city || !accessKey) {
    return res
      .status(400)
      .json({ error: 'Missing city or Unsplash access key' });
  }

  try {
    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${city}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    const data = await unsplashRes.json();
    const imageUrl = data.results?.[0]?.urls?.regular;

    if (!imageUrl) {
      return res.status(404).json({ error: 'No image found for that city' });
    }

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch image' });
  }
};
