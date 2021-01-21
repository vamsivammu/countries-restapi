import React from 'react'
import './App.css';
import {MDBDataTable} from 'mdbreact'
import axios from 'axios'
export default class App extends React.Component{
  constructor(props){
    super(props);
    this.columns = [{label:'Name',field:'name'},{label:'Code',field:'alpha'},{label:'Currency',field:'currency'},
    {label:'Language',field:'lang'},{label:'Captial',field:'capital'},{label:'Calling Code',field:'callingcode'},
    {label:'Region',field:'region'},{label:'Regional Bloc',field:'regionalbloc'}]
    this.arrayFields = [{label:'currencies',field:'code',key:'currency'},{label:'callingCodes',field:'',key:'callingcode'},
    {label:'regionalBlocs',field:'acronym',key:'regionalbloc'},{label:'languages',field:'name',key:'lang'}]
    this.state = {
      data:{columns:[],rows:[]},
      searchBy:'name',
      searchVal:''
    }


  }
  getUrl = ()=>{
    return `https://restcountries.eu/rest/v2/${this.state.searchBy}/${this.state.searchVal}`
  }
  search(){
    if(this.state.searchBy!='' && this.state.searchVal.trim()!=''){
      axios.get(this.getUrl()).then(res=>{
        let data = {columns:this.columns,rows:[]}
        res.data.forEach(row=>{
          let {name,capital,region} = row;
          let alpha = row['alpha3Code'];
          let eachrow = {name,capital,region,alpha}
          this.arrayFields.forEach(el=>{
            let val = "";
            if(el.field!=''){
              
              row[el.label].forEach(r=>{
                val = val + "," + r[el.field];
              })
              if(val.length>0) val = val.substr(1);

            }else{
              row[el.label].forEach(r=>{
                val = val + "," + r;
              })
              if(val.length>0) val = val.substr(1);
            }
            eachrow[el.key] = val;
          })
          data.rows.push(eachrow);
        })
        this.setState({data:data});
      }).catch(e=>{
        if(e.response){
          alert(e.response.data.message)
        }
      })
    }else{
      alert("Search By/Search Value should not be empty")
    }

  }
  searchByChangeHandler = (e)=>{
    this.setState({searchBy:e})
  }
  searchValChangeHandler = (e)=>{
    this.setState({searchVal:e})
  }
  render(){
    return (
      <div className="container">
        <br></br>
        <div className="row justify-content-around">
          
          <div className="form-group">
            <label className="grey-text">Search By</label>
            <select placeholder="Search By" className="form-control" value={this.state.searchBy} onChange={e=>this.searchByChangeHandler(e.target.value)}>
              {this.columns.map((col,ind)=><option value={col.field}>{col.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="grey-text">Enter value</label>
            <input placeholder="Enter.." className="form-control" value={this.state.searchVal} onChange={e=>this.searchValChangeHandler(e.target.value)}></input>
          </div>
          
          <div className="form-group">
            <button className="btn btn-primary" onClick={()=>this.search()}>Search</button>
          </div>

        </div>
        
        {this.state.data.rows.length>0 && <MDBDataTable data={this.state.data} paging={false}></MDBDataTable>}
      </div>
    );
  }

}

