
# URL Store

This is a test of serialising JSON into query parameters while "crushing" the JSON object to save space. The paractical limit for the length of URLs is ~2000 characters (https://stackoverflow.com/a/417184).

This may be useful for small web games/toys/apps/etc. where the application state may be saved using browser bookmarks, or shared simply as a link.

[JSONCrush](https://github.com/KilledByAPixel/JSONCrush) is used to "crush" the input JSON.

**View the [live demo here](https://url-store-test.netlify.app
)**

## Development

`npm install`

`npm run dev`
