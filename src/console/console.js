const { UiEngine } = require("./consoleEngine");
const { run } = require("../application/app");
const { ajax } = require("../infra/axiosAjax");
const { prompt } = require('inquirer');

const render = async (state, print, ask) => {
  if (state.loading) {
    print("loading");
    return;
  }

  switch (state.status) {
    case "nothing found":
      print("nothing found");
      break;

    case "found result":
      state.result._embedded.quotes.forEach(element => {
        print(`* ${element.value}`);
      });
      break;
  }

  await ask(state);
}

async function enterQuery() {
  const answer = prompt([
    {
      type: 'input',
      name: 'query',
      message: 'Enter search term'
    }
  ]);
  return answer;
}

const ask = async (state) => {
  const { query } = await enterQuery();
  if (query === "") {
    return;
  }
  state.commands.load(query);
}

const fullRender = (state) => render(state, console.log, ask);
const engine = new UiEngine(fullRender);

run(engine, ajax);