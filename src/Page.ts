import m from "mithril";
import stream from "mithril/stream";
import JSONCrush from "jsoncrush";

const initial = {
  greeting: "Howdy!",
  number: 65536,
  array: [
    { name: "dog", age: 3 },
    { name: "cat", age: 5 },
    { name: "parrot or something" },
    { name: "badger" },
  ],
  with: {
    some: {
      nesting: {
        here: "!",
      }
    }
  }
};

const entered = stream(JSON.stringify(initial, null, 2));
const crushed = entered.map(v => {
  let json = { error: "invalid JSON" };
  try {
    json = JSON.parse(v);
  } catch (error) { }
  return JSONCrush.crush(JSON.stringify(json));
});
const encoded = crushed.map(v => encodeURIComponent(v));
const decoded = encoded.map(v => decodeURIComponent(v));
const uncrushed = decoded.map(v => JSONCrush.uncrush(v));

const URL_KEY = "state";

function storeStringToUrl(toStore: string) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(URL_KEY, toStore);
  const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
  history.pushState(null, '', newRelativePathQuery);
}

function recallStringFromUrl(): string | undefined {
  const searchParams = new URLSearchParams(window.location.search);
  const sp = searchParams.get(URL_KEY);
  if (sp === null) return undefined;
  const decoded = decodeURIComponent(sp);
  const uncrushed = JSONCrush.uncrush(decoded);
  return uncrushed;
}

function loadFromUrl() {
  const str = recallStringFromUrl();
  let value = "{}";
  try {
    if (str !== undefined) {
      value = JSON.stringify(JSON.parse(str), null, 2);
    }
  } catch (error) { }
  entered(value);
}

export const Page: m.Component<{}> = {
  view() {
    return m(".flex.flex-col.space-y-2", [

      m(".space-y-2", [
        m("h1.my-4", "URL Store"),
        m("p", `This is a test of serialising JSON into query parameters while "crushing" the JSON object to save space. The paractical limit for the length of URLs is ~2000 characters (https://stackoverflow.com/a/417184).`),
        m("p", "This may be useful for small web games/toys/apps/etc. where the application state may be saved using browser bookmarks, or shared simply as a link."),
        m("p", [
          m("a", { href: "https://github.com/neon-fish/url-store" }, "Github repo"),
        ]),
        m("p", "In this test, the entered text must be valid JSON."),
      ]),

      m(".py-2.flex.items-center.space-x-2", [
        m("button", {
          onclick: () => entered(JSON.stringify(initial, null, 2)),
        }, "Load Initial Value"),

        m("button", {
          onclick: () => entered("{}"),
        }, "Clear Input"),

        m("", "|"),

        m("button", {
          onclick: () => storeStringToUrl(encoded()),
        }, "Store to URL"),

        m("button", {
          onclick: () => loadFromUrl(),
        }, "Load from URL"),
      ]),

      m(".flex.space-x-2", [
        m("label.w-32", `Enter value:`),
        m("textarea[rows=5].flex-1", {
          value: entered(),
          oninput: (e: any) => entered(e.target.value),
        }),
        m("label", entered().length),
      ]),

      m(".flex.space-x-2", [
        m("label.w-32", `Crushed:`),
        m("textarea[rows=5].flex-1", {
          disabled: true,
          value: crushed(),
        }),
        m("label", crushed().length),
      ]),

      m(".flex.space-x-2", [
        m("label.w-32", `Encoded:`),
        m("textarea[rows=5].flex-1", {
          disabled: true,
          value: encoded(),
        }),
        m("label", encoded().length),
      ]),

      m(".flex.space-x-2", [
        m("label.w-32", `Decoded:`),
        m("textarea[rows=5].flex-1", {
          disabled: true,
          value: decoded(),
        }),
        m("label", decoded().length),
      ]),

      m(".flex.space-x-2", [
        m("label.w-32", `Uncrushed:`),
        m("textarea[rows=5].flex-1", {
          disabled: true,
          value: uncrushed(),
        }),
        m("label", uncrushed().length),
      ]),

    ]);
  }
};
