import React, {useState, useEffect} from 'react';
import './App.css';

// componenets
import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'
import Alert from './components/Alert'

//uuid import
import uuid from 'uuid/v4'

// const initialExpenses = [
//   {id:uuid(), charge:"rent", amount:1600},
//   {id:uuid(), charge:"car payment", amount:12600},
//   {id:uuid(), charge:"card bill", amount:1300}
// ];
const initialExpenses = localStorage.getItem('expenses')? 
  JSON.parse(localStorage.getItem('expenses'))
  : []

function App() {

  const [expenses, setExpenses] = useState(initialExpenses);

  const [charge, setCharge] = useState('');
  const [amount, setAmount] = useState('');

  //alert
  const [alert, setAlert] = useState({show:false})

  //edit
  const [edit, setEdit] = useState(false);

  //edit item
  const [id, setId] = useState(0); 

  const handleCharge = e => {
    setCharge(e.target.value)
  }
  const handleAmount = e => {
    setAmount(e.target.value)
  }

  //useEffect
  useEffect(() => {
    localStorage.setItem(
      'expenses', 
      JSON.stringify(expenses));
  }, [expenses])
  // handle 
  const handleAlert = ({type, text}) => {
    setAlert({show:true, type, text});
    setTimeout(()=>{
      setAlert({show:false})
    },3000);
  }

  //handle submit
  const handleSubmit = e =>{
    e.preventDefault();
    if(charge !== '' && amount > 0){

      if(edit){
        let tempExpenses = expenses.map(item => {
          return item.id === id ? {
            ...item,
            charge,
            amount
          }
          :
          item
        })
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({
          type: 'success', 
          text: 'item successfully edited'
        });
      }
      else{
        const singleExpense = {
          id: uuid(), 
          charge,
          amount
        };  
        setExpenses([
          ...expenses, 
          singleExpense
        ]);
        handleAlert({
          type: 'success', 
          text: 'item successfully added'
        });
      }
      
      setCharge('');
      setAmount('');
    }
    else{
      handleAlert({
        type: 'danger', 
        text: `charge and amount can't be empty and amount must be greater than zero`
      });  
    }

  };

  //clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({type:'danger', text:` cleared items`})
  };

  //handle delete
  const handleDelete = id => {
    let tempExpenses = expenses.filter(item => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({type:'danger', text:` item deleted`})
  };

  //handle Edit
  const handleEdit = id =>{
    let expense = expenses.find(item => item.id === id);
    let {charge, amount} = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }

  return (
    <> 
    {alert.show && <Alert 
    type={alert.type}
    text={alert.text}
    />}
    <h1>Buget calculator</h1>
    <main className="App">
      <ExpenseForm 
      charge={charge} 
      amount={amount} 
      handleCharge={handleCharge}
      handleAmount={handleAmount}
      handleSubmit={handleSubmit}
      edit={edit}
      />

      <ExpenseList 
      expenses={expenses}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      clearItems={clearItems}
      />
    </main>
    <h1> total spending : 
      <span className="total">
        $ 
        {expenses.reduce((acc,curr) => {
          return (acc += parseInt(curr.amount));
        }, 0)}
      </span>
      </h1>

    </>
  );
}

export default App;
