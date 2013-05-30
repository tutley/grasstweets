/**
 * constants.js - this file contains a few global constants for categorizing things
 */

var constants = {};

constants.categories = [
   { 'name':'US House', 'short':'ushouse'},
   { 'name':'US Senate', 'short':'ussenate'},
   { 'name':'US Executive', 'short':'usexec'},
   { 'name':'State House', 'short':'sthouse'},
   { 'name':'State Senate', 'short':'stsenate'},
   { 'name':'State Executive', 'short':'stexec'}];

constants.parties = [
   { 'name': 'Republican', 'short':'R'},
   { 'name': 'Democrat', 'short':'D'},
   { 'name': 'Other', 'short': 'O'}];


module.exports = constants;
