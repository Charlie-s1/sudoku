import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './index.css';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';
const sets = [[
    [0,1,2,3,4,5,6,7,8],
    [9,10,11,12,13,14,15,16,17],
    [18,19,20,21,22,23,24,25,26],
    [27,28,29,30,31,32,33,34,35],
    [36,37,38,39,40,41,42,43,44],
    [45,46,47,48,49,50,51,52,53],
    [54,55,56,57,58,59,60,61,62],
    [63,64,65,66,67,68,69,70,71],
    [72,73,74,75,76,77,78,79,80],
],[
    [0,9,18,27,36,45,54,63,72],
    [1,10,19,28,37,46,55,64,73],
    [2,11,20,29,38,47,56,65,74],
    [3,12,21,30,39,48,57,66,75],
    [4,13,22,31,40,49,58,67,76],
    [5,14,23,32,41,50,59,68,77],
    [6,15,24,33,42,51,60,69,78],
    [7,16,25,34,43,52,61,70,79],
    [8,17,26,35,44,53,62,71,80],
],[
    [0,1,2,9,10,11,18,19,20],
    [3,4,5,12,13,14,21,22,23],
    [6,7,8,15,16,17,24,25,26],
    [27,28,29,36,37,38,45,46,47],
    [30,31,32,39,40,41,48,49,50],
    [33,34,35,42,43,44,51,52,53],
    [54,55,56,63,64,65,72,73,74],
    [57,58,59,66,67,68,75,76,77],
    [60,61,62,69,70,71,78,79,80],
]];
let holding = "";

function Digit(props){
    const [{isOver}, drop] = useDrop( () => ({
        accept: "guessNum",
        drop: () => {
            props.dropped(holding,props.number);
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    }))
    if (!props.lock){
        return(
            <div className="digitCont" ref={drop}>
                {isOver ?
                    <p className="digit" style={{opacity:.2}}>{props.value || holding}</p> :
                    <p className="digit">{props.value}</p>
                }
            </div>   
        )
    }else{
        return(
            <div className="digitCont lock">
                <p className="digit">{props.value}</p>
            </div>   
        )
    }
    
}
class Board extends React.Component{
    renderDigit(i){
        return(<Digit
            key={i}
            number={i}
            value={this.props.numbers[i]}
            lock={this.props.numLock[i]}
            dropped = {(i,n) => this.props.dropped(i,n)}
        />)
    }
    renderBox(){
        let toReturn=[];
        for(let i=0;i<81;i++){
            toReturn.push(this.renderDigit(i))
        }
        return(toReturn);
    }
    render(){
        return(<div id="board">
            {this.renderBox()}
            </div>
        )
    }
}
function GuessNum(props){
    const [{isDragging}, dragRef] = useDrag(() => ({
        type: "guessNum",
        collect: (monitor) => ({
            isDragging:monitor.isDragging(),
        }),
    }));
    return(
        <p
            ref={dragRef} 
            style={{
                opacity: isDragging ? 0.2:1,
            }}
            onMouseDown={(e) => {
                holding = e.target.textContent;
            }}
        >{props.value}</p>
    )
}
class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            numbers:Array(81).fill(null),
            numLock:Array(81).fill(false),
        }
        let start = createGameStart(this.state.numbers);
        this.state.numbers = start.newNums;
        this.state.numLock = start.newNumLock;
    }
    handleDropped(i,n){
        const newNumbers = this.state.numbers.slice();
        newNumbers[n] = +i;
        this.setState({
            numbers:newNumbers,
        });
    }
    render(){
        return(
            <div id="game">
                <Board
                    numbers={this.state.numbers}
                    numLock={this.state.numLock}
                    dropped={(i,n) => this.handleDropped(i,n)}
                />
                <div id="guessOpt">
                    <GuessNum value="1"/>
                    <GuessNum value="2"/>
                    <GuessNum value="3"/>
                    <GuessNum value="4"/>
                    <GuessNum value="5"/>
                    <GuessNum value="6"/>
                    <GuessNum value="7"/>
                    <GuessNum value="8"/>
                    <GuessNum value="9"/>
                </div>
            </div>
        )
    }
}
// function gameWin(squares){
// }
function createGameStart(numbers){
    let newNums=[];
    let newNumLock = [];
    for (const set of sets[0]){
        const nums = set.map((i) => numbers[i]);
        nums[Math.floor(Math.random()*nums.length)] = Math.floor(Math.random()*9)+1;
        for (const i of nums){
            newNums.push(i);
            newNumLock.push(i ? true : false);
        }
    }
    for (const set of sets[1]){
        const nums = set.map((i) => numbers[i]);
        nums[Math.floor(Math.random()*nums.length)] = Math.floor(Math.random()*9)+1;
        let count = 0
        for(const i of set){
            newNums[i] = newNums[i]==null ? nums[count] : newNums[i];
            newNumLock[i] = newNums[i]!=null ? true : false;
            count++;
        }
    }
    for (const set of sets[2]){
        const nums = set.map((i) => numbers[i]);
        nums[Math.floor(Math.random()*nums.length)] = Math.floor(Math.random()*9)+1;
        let count = 0;
        for(const i of set){
            newNums[i] = newNums[i]==null ? nums[count] : newNums[i];
            newNumLock[i] = newNums[i]!=null ? true : false;
            count++;
        }
    }
    newNums = check(sets[0],newNums);
    newNums = check(sets[1],newNums);
    newNums = check(sets[2],newNums);
    
    newNumLock = newNums.map((i) => i ? true:false);

    return {newNums, newNumLock}
}
function check(bigSet,nums){
    for (const set of bigSet){
        const compare = set.map((i) => nums[i]);
        const checkSet = set.map((i) => nums[i]);
        for(const i of checkSet){
            if(i){
                compare[compare.indexOf(i)] = null;
            }
            if (i && compare.includes(i)){
                checkSet[checkSet.indexOf(i)] = null;
            }
        }
        for (let i=0;i<checkSet.length;i++){
            nums[set[i]] = checkSet[i];
        }
    }
    return nums;
}
ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <Game/>
    </DndProvider>,
    document.getElementById("root")
)