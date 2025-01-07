let game_board;
let api_request_finished;

const config = {
  grid: {
    columns: 5,
    rows: 4,
    invisible_rows: 2
  },
  tile_size_pixels: 100,
  spin: {
    step_duration_seconds: 0.3,
    column_delay_ms: 125
  }
}

function random_number(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function stop(){
  log('API Request Finished')
  const stop_style = document.querySelector('#dd_stop').value;
  game_board.classList.add(`stop-${stop_style}`)
  setTimeout(() => {
    api_request_finished = true
  }, 300) // TODO this needs to be the current timing duration
}

async function api_call() {
  api_request_finished = false
  game_board.className = '';
  // const api_delay_seconds = random_number(0, 10)
  const api_delay_seconds = 200
  log(`API Request started: ends in ${api_delay_seconds}s`)
  setTimeout(() => {
    game_board.classList.remove('spinning')
    stop();
  }, api_delay_seconds * 1000)
}

function log(message) {
  const timestamp = new Date().toLocaleString()
  document.getElementById('logs').innerHTML += `${timestamp.padEnd(25, '')} | ${message} <br/>`;
}

function Tile(column_index, row_index) {
  const element = document.createElement('div');
  element.setAttribute('row', row_index);
  element.setAttribute('column', column_index);
  element.id = `tile_${column_index}x${row_index}`;
  element.classList.add('tile');
  element.style.top = y_coordinate_for_row_index(row_index)
  element.move_down = move_tile_down(element)
  return element;
}

function y_coordinate_for_row_index(row_index) {
  return `${(row_index - 2) * config.tile_size_pixels}px`
}

function Reel() {
  const element = document.createElement('div');
  element.classList.add('reel');
  return element;
}

function get_y_coordinate(element){
  const top_value = window.getComputedStyle(element).getPropertyValue('top');
  return parseInt(top_value)
}

function inject_css_variables(){
  const id = 'slot-variables';
  let style_element = document.body.querySelector(`#${id}`);
  if(!style_element){
    style_element = document.createElement('style');
    style_element.id = id;
  }

  style_element.innerHTML = `
    :root {
      --rows: ${config.grid.rows};
      --columns: ${config.grid.columns};
      --tile-size: ${config.tile_size_pixels}px;
      --tile-step-duration: ${config.spin.step_duration_seconds}s;
    }
  `;
  document.body.appendChild(style_element);
}

document.addEventListener('DOMContentLoaded', () => {
  game_board = document.getElementById('game_board');
  inject_css_variables();
  setup_game_board(config)
})
