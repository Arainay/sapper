"use strict";

(function() {
	let container = document.getElementById("container"),
		btns = document.querySelector(".btns"),
		field = document.querySelector(".field"),
		levelBtn = document.querySelector(".btns [disabled]"),
		bombCount = 10,
		flagCount = 10,
		cells = [],
		dangerousCells = [];
	
	function cleanField() {
		let iterCount = field.childElementCount;
		for (let i = 0; i < iterCount; i++) {
			field.removeChild(field.firstElementChild);
		}
		dangerousCells.length = 0;
	}
	
	function createCells(cellCount) {
		cleanField();
		for (let i = 0; i < cellCount; i++) {
			cells[i] = document.createElement("div");
			cells[i].className = "cell";
			cells[i].addEventListener("click", function(e) {
				openCell(e.target);				
			}, false);
			cells[i].addEventListener("contextmenu", function(e) {
				e.preventDefault();
				toggleFlag(e.target);
			}, false);
			field.appendChild(cells[i]);
		}
		plantBomb(bombCount);
	}
	
	function toggleFlag(cell) {
		let flagsElem = document.querySelector(".flags-count");
		if (cell.className.indexOf("flag") !== -1)
			flagCount++;
		else
			flagCount--;
		flagsElem.innerHTML = flagCount;
		cell.classList.toggle("flag");
	}
	
	function openCell(cell) {
		if (cell.className.indexOf("open") === -1 && cell.className.indexOf("flag") === -1) {
			cell.classList.add("open");
			let bombCountAround = getBombCountAround(cell);
			if (cell.className.indexOf("boom") === -1)
				cell.innerHTML = "<span>" + ((bombCountAround === 0) ? '' : bombCountAround) + "</span>";			
		}
	}
	
	function getAroundCells(cell) {
		let cellsInStr = (cells.length === 100) ? 10 : 50,
			activeCell = cells.indexOf(cell),
			cellsAround = [
				activeCell - cellsInStr - 1,
				activeCell - cellsInStr,
				activeCell - cellsInStr + 1,
				activeCell - 1,
				activeCell + 1,
				activeCell + cellsInStr - 1,
				activeCell + cellsInStr,
				activeCell + cellsInStr + 1
			],
			aroundCells = [];
			
		aroundCells.length = 0;
		cellsAround.map(function(item, iter, arr) {
			if (item >= 0 && item < cells.length) {
				if ((item + 1) % cellsInStr !== 0 && activeCell % cellsInStr === 0)
					aroundCells.push(item);
				else if ((activeCell + 1) % cellsInStr === 0 && item % cellsInStr !== 0)
					aroundCells.push(item);
				else if (activeCell % cellsInStr !== 0 && (activeCell + 1) % cellsInStr !== 0)
					aroundCells.push(item);
			}			
		});
		return aroundCells;
	}
	
	function getBombCountAround(cell) {
		let bombAroundCount = 0,
			aroundCells = getAroundCells(cell);
		dangerousCells.forEach(function(item) {
			if (aroundCells.indexOf(item) !== -1)
				bombAroundCount++;			
		});
		if (bombAroundCount === 0) {
			openAroundCells(aroundCells);
		}
		return bombAroundCount;
	}
	
	function openAroundCells(aroundCells) {
		let cellsToOpen = [];
		aroundCells.forEach(function(item) {
			if (cells[item].className.indexOf("open") === -1)
				cellsToOpen.push(cells[item]);
		});
		cellsToOpen.forEach(function(i) {
			openCell(i);
		});
	}
	
	function generateRandomNumber(min, max) {
		return Math.floor(Math.random() * max) + min;
	}
	
	function fillingDangerousCells() {
		let number = generateRandomNumber(0, cells.length);
			if (dangerousCells.indexOf(number) === -1) {
				dangerousCells.push(number);
				cells[number].addEventListener("click", function() {
					if (cells[number].className.indexOf("flag") === -1) {
						cells[number].classList.add("boom");
						alert("Вы проиграли :(");
						createCells(cells.length);
					}
				}, false);
			}
			else
				fillingDangerousCells();
	}
	
	function plantBomb(bombCount) {
		for (let i = 0; i < bombCount; i++) {
			fillingDangerousCells();
		}
		console.log(dangerousCells);
	}
	
	
	createCells(100);	
})();