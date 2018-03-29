# Browser Technologies
//Robuuste, toegankelijke websites leren bouwen …

# BEATBOX SAMPLER
Dit is een demo gebaseerd op audio samplers.
Je kunt een geluid opnemen en deze herhaald af laten spelen.
Je kunt ook kiezen wanneer de geluiden worden afgespeeld.

## Core
Core functionaliteit is het afspelen van geluid. (IE9)

## Acceptable
In nieuwe browsers is het mogelijk om geluiden op te nemen en deze herhaald af te spelen.

## Enjoyable
De geluiden worden gevisualiseerd.

## Browser compatibility
De demo gebruikt vrij nieuwe technieken om plezierig te zijn.
Hieronder geef ik per techniek aan welke (populaire) browser, en versie, dit ondersteunt

- `window.matchMedia`
	- IE10
	- Edge
	- Safari 5.1
	- Chrome 9
	- Firefox 6
	- Opera 12.1
- `Array.prototype.forEach`
	- IE9 (When not in 'strict mode')
	- Edge
	- Safari 6
	- Firefox 21
	- Chrome 23
	- Opera 15
- `document.querySelector`
	- IE9
	- Edge
	- Safari 3.1
	- Firefox 3.5
	- Chrome 4
	- Opera 10.1
- `window.AudioContext || window.webkitAudioContext`
	- IE *Geen Support*
	- Edge 12
	- Safari 6 (With _webkit_ prefix)
	- Firefox 25
	- Chrome 34
	- Opera 22
- `navigator.mediaDevices.getUserMedia`
	- IE *Geen Support*
	- Edge 12
	- Safari 11
	- Firefox 42
	- Chrome 53
	- Opera 40
- `new MediaRecorder`
	- IE *Geen Support*
	- Edge *Geen Support*
	- Safari *Geen Support*
	- Firefox 29
	- Chrome 49
	- Opera 36



## Opdracht 3 - Progressive Enhanced Browser Technologies
//Browser Technologies onderzoeken en implementeren als enhancement. Basic functionaliteit van een use case doorgronden.

Maak een demo op basis van een use case. Zorg dat alle gebruikers, met alle browsers, in iedere context minimaal de core functionaliteit te zien/horen/voelen krijgen. Bouw je demo in 3 lagen, volgens het principe van Progressive Enhancement. Gebruik als enhanced feature een (hippe, innovatieve, vooruitstrevende) Browser Technologie die je gaat onderzoeken op functionaliteit, toegankelijkheid en (browser) ondersteuning.


Beoordelingscriteria
- De code staat in een repository op GitHub
- Er is een Readme toegevoegd met daarin beschreven:
  - een beschrijving van de core functionality
  - een beschrijving van de feature(s)/Browser Technologies
  - welke browser de feature(s) wel/niet ondersteunen
  - een beschrijving van de accessibility issues die zijn onderzocht
- De demo is opgebouwd in 3 lagen, volgens het principe van Progressive Enhancement
- De user experience van de demo is goed
  - de leesbaarheidsregels zijn toegepast, contrast en kleuren kloppen
  - het heeft een gebruiksvriendelijke interface, met gebruikmaking van affordance en feedback op de interactieve elementen
- Student kan uitleggen wat Progressive Enhancement en Feature Detectie is en hoe dit toe te passen in Web Development
