var chessground = require('chessground');
var layout = require('../layout');
var widgets = require('../_commonWidgets');
var menu = require('../menu');
var ground = require('./ground');
var renderPromotion = require('./promotion').view;
var utils = require('../../utils');
var i18n = require('../../i18n');
var game = require('../round/game');
var gameStatus = require('../round/status');
var renderMaterial = require('../round/view/roundView').renderMaterial;
var replayView = require('./replay/replayView');

function renderGameEndedActions(ctrl) {
  var result;
  if (gameStatus.finished(ctrl.data)) switch (ctrl.data.game.winner) {
    case 'white':
      result = '1-0';
      break;
    case 'black':
      result = '0-1';
      break;
    default:
      result = '½-½';
  }
  var status = gameStatus.toLabel(ctrl.data) +
    (winner ? '. ' + i18n(winner.color === 'white' ? 'whiteIsVictorious' : 'blackIsVictorious') + '.' : '');
  return [
    m('div.result', [result, m('br'), m('br'), status]),
    m('div.control.buttons', button.backToGame(ctrl))
  ];
}

function renderGameActions(ctrl) {
  var d = ctrl.data;
  return [
    m('div.actions', [
      m('button[data-icon=U]', {
        config: utils.ontouchend(utils.ƒ(ctrl.init))
      }, i18n('createAGame')),
      m('br'), m('br'), m('button[data-icon=L]', {
      config: utils.ontouchend(ctrl.hideActions)
    }, i18n('backToGame'))
    ])
  ];
}

function renderPlayerActions(ctrl) {
  if (!ctrl.vm.showingActions) return;
  return m('div.overlay', [
    m('button.overlay_close.fa.fa-close', {
      config: utils.ontouchend(ctrl.hideActions)
    }),
    m('div#player_controls.overlay_content', renderGameActions(ctrl))
  ]);
}

function renderGameButtons(ctrl) {
  var actions = [
    m('button#open_player_controls.game_action.fa.fa-ellipsis-h', {
      config: utils.ontouchend(ctrl.showActions)
    }),
    m('button.game_action.empty[data-icon=c]'),
    replayView.renderButtons(ctrl.replay)
  ];
  return m('section#game_actions', actions);
}

module.exports = function(ctrl) {

  var material = chessground.board.getMaterialDiff(ctrl.chessground.data);

  function footer() {
    return [
      renderGameButtons(ctrl),
      renderPlayerActions(ctrl)
    ];
  }

  function header() {
    return m('nav', [
      widgets.menuButton(),
      widgets.gameButton(),
      m('h1.playing', 'OTB')
    ]);
  }

  function board() {
    var x = utils.getViewportDims().vw;
    return m('section.board_wrapper.otb', {
      style: {
        height: x + 'px'
      }
    }, [
      m('div', {
        class: 'board grey merida standard',
      }, chessground.view(ctrl.chessground), renderPromotion(ctrl))
    ]);
  }

  function renderMenu() {
    return menu.view(utils.partialƒ(ground.applySettings, ctrl.chessground));
  }

  return layout.board(header, board, footer, renderMenu, null, 'white');
};