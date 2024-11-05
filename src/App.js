import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tinycolor from "https://cdn.skypack.dev/tinycolor2@1.4.2";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@2.4.0";
import './App.css';
import "./App.scss";
import './styles/main.css';
/* styled.js  */
const EmptyDay = styled.div`
  border:1px solid #ddd;  padding:10px; background-color: #ededed; opacity: 0.6;  
`;
const CalendarContainer = styled.div`
  font-family:Arial,sans-serif;
  position:relative;
  left:50%; 
  top:0px;
  transform: translateX(-50%);
  width:1000px;
  height:700px;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 60px
`;
const CalendarHeader = styled.div`
  display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;
`;
const DaysGrid = styled.div`
  display:grid;  grid-template-columns:repeat(7,1fr); gap:5px; height: 400px; width: 1000px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%,-50%);
`;
const DayName = styled.div`
  text-align:center; font-weight:bold; padding:5px; background-color:#fff;
`;
const Day = styled.div`
  border:1px solid #ddd;  padding:10px;  text-align:center; cursor:pointer;
  background-color:${props => props.isSelected ? '#9f9ffa' : '#fff'};  position:relative;
  line-height: 42px;

  &:hover{ background-color:#ddd; }
`;
const TodoIndicator = styled.div`
  position:absolute; top:2px; right:2px; background-color:#07f; color:#fff; border-radius:50%;
  width:20px; height:20px; font-size:12px; display:flex; align-items:center; justify-content:center;
`;
const Button = styled.button`
  background-color:#fff; color:#fff; border:0 none; padding:5px 10px; cursor:pointer;
  margin-left:5px;  margin-right:5px;
  &:hover{  background-color:#05b;  }
`;
const MonthSelect = styled.select`
  font-size:1rem; padding:5px;  margin:0 10px;
`;

const TodoListContainer = styled.div`
position:absolute; left:0px; bottom:20px;
`;
const TodoForm = styled.form`
  display:flex;  margin-bottom:10px;
`;
const TodoUl = styled.ul`
  list-style-type:none;  padding:0;
`;
const TodoLi = styled.li`
  display:flex;  align-items:center;  margin-bottom:5px;
`;
const TodoCheckbox = styled.input`
  margin-right:10px;
`;
const TodoText = styled.span`
  flex-grow:1;
  text-decoration:${props => props.completed ? 'line-through' : 'none'};
  font-style:${props => props.completed ? 'italic' : 'normal'};
  margin-top:1.1rem;
`;


const CalendarTodo = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  /* const monthArray = [1,2,3,4,5,6,7,8,9,10,11,12] */

  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState({});
  const currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || {};
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const daysPerMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const clickDate = (day) => {
    const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    setSelectedDate(dateString);
  }

  const addTodo = (date, todo) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [date]: [...(prevTodos[date] || []), { text: todo, completed: false }]
    }))
  }
  const removeTodo = (date, index) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [date]: prevTodos[date].filter((_, i) => i !== index)
    }))
  }
  const editTodo = (date, index, newText) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [date]: prevTodos[date].map((todo, i) =>
        i === index ? { ...todo, text: newText } : todo
      )
    }))
  }

  const toggleTodo = (date, index) => {
    setTodos(prevTodos => ({
      ...prevTodos,
      [date]: prevTodos[date].map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    }))
  }


  const renderCalendar = () => {
    const blanks = Array(firstDay).fill(null);
    const currentDays = Array.from({ length: daysPerMonth }, (_, i) => i + 1);
    const allDays = [...blanks, ...currentDays];

    return allDays.map((day, index) => {
      if (day === null) return <EmptyDay key={index} />
      const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const isSelected = selectedDate === dateString;
      const todoForDay = todos[dateString] || [];
      return (
        <Day key={index}
          isSelected={isSelected}
          onClick={() => clickDate(day)}>
          {day}
          {todoForDay.length > 0 && (<TodoIndicator>{todoForDay.length}</TodoIndicator>)}
          {/* 조건부 렌더링  선행조건이 true이면 &&이후 평가후 렌더링하는 jsx코드 */}
        </Day>
      )
    })
  }

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1);
    navigate(`/calendar/${newDate.getFullYear()}/${newDate.getMonth() + 1}`);
  }

  const selectMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    navigate(`/calendar/${currentDate.getFullYear()}/${newMonth}`);
  }


  return (
    <body>

      <CalendarContainer className='main_container'>
        <CalendarHeader>
          <div class="buttons">
            <button class="button" onClick={() => changeMonth(-1)}>
              <span>이전 달</span>
            </button>
          </div>
          <p>{currentDate.getFullYear()}년</p>
          <MonthSelect value={currentDate.getMonth() + 1} onChange={selectMonthChange} className='sel '>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month, index) => (
              <option key={month} value={month}>{month} 월</option>
            ))}
          </MonthSelect>
          <div class="buttons">
            <button class="button" onClick={() => changeMonth(1)}>
              <span>다음 달</span>
            </button>
          </div>
        </CalendarHeader>
        <DaysGrid className='days'>
          {
            ['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <DayName key={day}>{day}</DayName>
            ))
          }
          {renderCalendar()}
        </DaysGrid>
        <TodoList todos={todos} addTodo={addTodo} removeTodo={removeTodo} toggleTodo={toggleTodo}
          editTodo={editTodo} selectedDate={selectedDate} />
      </CalendarContainer>
    </body>
  )
}

const TodoList = ({ todos, addTodo, removeTodo, editTodo, selectedDate, toggleTodo }) => {
  const [newTodo, setNewTodo] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const sendSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim() && selectedDate) {
      addTodo(selectedDate, newTodo.trim());
      setNewTodo('');
    }
  }
  const editCall = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  }
  const submitEdit = (date, index) => {
    editTodo(date, index, editText);
    setEditingIndex(null);
  }


  return (
    <TodoListContainer>
      <section>
        <div class="c1"></div>
        <div class="c2"></div>
        <div class="c3"></div>
        <div class="c4"></div>
      </section>
      <section>
        <h3>계획 추가하기</h3>
      </section>
      <TodoForm onSubmit={sendSubmit}>
        <label for="inp" class="inp">
          <input type="text" id="inp" placeholder="&nbsp;" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
          <span class="label"></span>
          <svg width="120px" height="26px" viewBox="0 0 120 26">
            <path d="M0,25 C21,25 46,25 74,25 C102,25 118,25 120,25"></path>
          </svg>
          <span class="border"></span>
        </label>
        <Button type="submit">
          <a class="bt more-bt" href="javascript:void(0)">
            <span class="fl"></span><span class="sfl"></span><span class="cross"></span><i></i>
            <p>add</p>
          </a>
        </Button>
      </TodoForm>
      {selectedDate && (
        <TodoUl>
          {(todos[selectedDate] || []).map((todo, index) => (
            <TodoLi key={index}>
              {editingIndex === index ? (
                <>
                  <input type="text" id='text' value={editText} onChange={(e) => setEditText(e.target.value)} />
                  <Button id="save" onClick={() => submitEdit(selectedDate, index)}><span>저장</span></Button>
                </>
              ) : (
                <>
                  <TodoCheckbox type="checkbox" checked={todo.completed} onChange={() => {
                    toggleTodo(selectedDate, index);
                  }} />
                  <TodoText id="todotext" completed={todo.completed}>{todo.text}</TodoText>
                  <Button id="edit" onClick={() => editCall(index, todo.text)}><span>수정</span></Button>
                  <Button id="del" onClick={() => removeTodo(selectedDate, index)}><span>삭제</span></Button>
                </>
              )}
            </TodoLi>
          ))}
        </TodoUl>
      )}
    </TodoListContainer>
  )
}

/*배경 그라디언트*/
const simplex = new SimplexNoise(Math.random);

console.clear();

class GradientBG {
  constructor(width = 1920, height = 1080, target = document.body) {
    this.width = width;
    this.height = height;
    this.target = target;

    this.svgns = "http://www.w3.org/2000/svg";
    this.SVGElement = this._createSVGElement();

    this.id = Math.random();
  }

  generate() {
    this.SVGElement.innerHTML = "";
    this.defs = this._createDefs();
    this.backgroundGradient = this._createBackgroundGradient();
    this.blurFilter = this._createBlurFilter();

    let baseColor = tinycolor(
      `hsl(${~~this._random(0, 360)}, ${this._random(75, 100)}, ${this._random(
        80,
        92
      )}%)`
    );

    let combinations = baseColor.splitcomplement();
    let secondaryColor = combinations[~~this._random(1, combinations.length)];

    let secondaryCombinations = secondaryColor.splitcomplement();

    const stopOffset1 = this._random(0, 25);
    const stopOffset2 = 100 - this._random(0, 25);

    this.backgroundGradient.stop1.setAttribute(
      "stop-color",
      baseColor.toHslString()
    );
    this.backgroundGradient.stop2.setAttribute(
      "stop-color",
      secondaryColor.toHslString()
    );

    this.backgroundGradient.stop1.setAttribute("offset", `${stopOffset1}%`);
    this.backgroundGradient.stop2.setAttribute("offset", `${stopOffset2}%`);

    const maxBlobSize = Math.min(this.width, this.height);

    this._blob({
      x: `${this._random(0, this.width / 4)}`,
      y: `${this._random(0, this.height / 4)}`,
      r: `${this._random(maxBlobSize / 2, maxBlobSize)}`,
      fill: combinations[~~this._random(0, combinations.length)]
    });

    this._blob({
      x: `${this._random(this.width - this.width / 4, this.width)}`,
      y: `${this._random(0, this.height / 4)}`,
      r: `${this._random(maxBlobSize / 2, maxBlobSize)}`,
      fill: combinations[~~this._random(0, combinations.length)]
    });

    this._blob({
      x: `${this._random(0, this.width / 4)}`,
      y: `${this._random(this.height - this.height / 4, this.height)}`,
      r: `${this._random(maxBlobSize / 2, maxBlobSize)}`,
      fill:
        secondaryCombinations[~~this._random(0, secondaryCombinations.length)]
    });

    this._blob({
      x: `${this._random(this.width - this.width / 4, this.width)}`,
      y: `${this._random(this.height - this.height / 4, this.height)}`,
      r: `${this._random(maxBlobSize / 2, maxBlobSize)}`,
      fill:
        secondaryCombinations[~~this._random(0, secondaryCombinations.length)]
    });
  }

  _createSVGElement() {
    const el = document.createElementNS(this.svgns, "svg");

    el.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
    el.setAttribute("preserveAspectRatio", "xMidYMid slice");

    this.target.appendChild(el);

    return el;
  }

  _createDefs() {
    const el = document.createElementNS(this.svgns, "defs");

    this.SVGElement.appendChild(el);

    return el;
  }

  _createBackgroundGradient() {
    const el = document.createElementNS(this.svgns, "linearGradient");

    el.id = "bgGradient" + this.id;
    el.setAttribute("gradientTransform", "rotate(90)");

    const stop1 = document.createElementNS(this.svgns, "stop");
    stop1.setAttribute("offset", `${~~this._random(0, 25)}%`);

    const stop2 = document.createElementNS(this.svgns, "stop");
    stop2.setAttribute("offset", `${~~this._random(75, 100)}%`);

    el.appendChild(stop1);
    el.appendChild(stop2);

    this.defs.appendChild(el);

    const rect = document.createElementNS(this.svgns, "rect");

    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", `url(#bgGradient${this.id})`);

    this.SVGElement.appendChild(rect);

    return {
      rect: rect,
      stop1: stop1,
      stop2: stop2
    };
  }

  _createBlurFilter() {
    const el = document.createElementNS(this.svgns, "filter");

    el.id = "blur" + this.id;
    el.setAttribute("x", "-100%");
    el.setAttribute("y", "-100%");
    el.setAttribute("width", "300%");
    el.setAttribute("height", "300%");

    const gaussianBlur = document.createElementNS(this.svgns, "feGaussianBlur");

    gaussianBlur.setAttribute("in", "SourceGraphic");
    gaussianBlur.setAttribute("stdDeviation", this._random(100, 110));

    el.appendChild(gaussianBlur);

    this.defs.appendChild(el);

    return el;
  }

  _blob({ x, y, r, fill, filter = `url(#blur${this.id})` }) {
    const circle = document.createElementNS(this.svgns, "circle");

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);

    circle.setAttribute("fill", fill);
    circle.setAttribute("filter", filter);

    this.SVGElement.appendChild(circle);

    return circle;
  }

  _random(min, max) {
    return Math.random() * (max - min) + min;
  }
}

const gradient = new GradientBG();
gradient.generate();

const circles = [];

document.querySelectorAll("circle").forEach((el) => {
  circles.push({
    el,
    x: ~~el.getAttribute("cx"),
    y: ~~el.getAttribute("cy"),
    originX: ~~el.getAttribute("cx"),
    originY: ~~el.getAttribute("cy"),
    xOff: Math.random(),
    yOff: Math.random()
  });
});

function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

(function animate() {
  circles.forEach((c) => {
    const noiseX = simplex.noise2D(c.xOff, c.xOff);
    const noiseY = simplex.noise2D(c.yOff, c.yOff);

    const x = map(noiseX, 0, 1, 0, 1920);
    const y = map(noiseY, 0, 1, 0, 1080);

    c.el.setAttribute("cx", x);
    c.el.setAttribute("cy", y);

    c.xOff += 0.0009; // 백그라운드 그라데이션 속도 제어
    c.yOff += 0.0009; // 백그라운드 그라데이션 속도 제어
  });
  requestAnimationFrame(animate);
})();

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/"><span class="stripe1">
              INTRO
            </span></Link></li>
            <li><Link to="/calendar/2024/8"><span class="stripe2">
            Calendar Plan
            </span></Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route exact path='/' element={<IntroPage />} />
        <Route path='/calendar/:year/:month' element={<CalendarTodo />} />
      </Routes>
    </Router>
  );
}
const IntroPage = () => {
  return <h1 data-text="달력 일정 페이지">달력 일정 페이지</h1>

}

export default App;
