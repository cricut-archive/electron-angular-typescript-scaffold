import {bootstrap, module } from 'angular';
import * as bowser from 'bowser';

const mModule = module('app', []);   
bootstrap(document, ['app']);

document.getElementById('name').innerText = bowser.name;