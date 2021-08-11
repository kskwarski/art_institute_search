import './App.css';
import {useState, useEffect} from 'react';


function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [qry, setQry ] = useState("");
  const [searchParams] = useState(["title", "description", "is_featured", "gallery_title", "type"]);

  useEffect(() => {
    fetch(`https://api.artic.edu/api/v1/exhibitions?limit=30`)
      .then((res) => res.json())
      .then(
          (result) => {
            setIsLoaded(true);
            setItems(result['data']);
  
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  //filtrowanie tabeli
  const search = (items) => {
    return items.filter((item) => {
          return searchParams.some((newItem) => {
              return (
                item[newItem] ? item[newItem].toString().toLowerCase().indexOf(qry.toLowerCase()) > -1 : ""
        );
      });
    })
  }

  //sortowanie tabeli
  const[sortedFieldConfig, setSortedFieldConfig] = useState({});
  const runSort = (field) => {
    let order = 'asc';
    if(sortedFieldConfig.field === field && sortedFieldConfig.order === 'asc'){
      order = 'desc'
    }
    setSortedFieldConfig({field, order});
  }
  
  const sorted = (items) => {
    let sortedItems = [...items];
    sortedItems.sort((a, b) => {
      if (a[sortedFieldConfig.field] < b[sortedFieldConfig.field]){
        return sortedFieldConfig.order === 'asc' ? -1 : 1;
      }
      if (a[sortedFieldConfig.field] > b[sortedFieldConfig.field]){
        return sortedFieldConfig.order === 'asc' ? 1 : -1; 
      }
      return 0;
    })
    return sortedItems;
  }


  if(error) {
    return <>{error.message}</>;
  } else if(!isLoaded) {
    return<>loading...</>;
  } else {
    
    //renderowanie danych w tabeli
    return(
      <div className="container">
        <div className="row py-3">
          <div className="col-6 mx-auto">
            <input type="search" className="form-control" placeholder="Search" value={qry} onChange={(e) => setQry(e.target.value)}/>
          </div>
        </div>
        
        <div className="row">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr className="text-center align-middle">
                <th scope="col" onClick={() => runSort('title')}>Title</th>
                <th scope="col" onClick={() => runSort('description')}>Description</th>
                <th scope="col" onClick={() => runSort('is_featured')}>Is Featured</th>
                <th scope="col" onClick={() => runSort('gallery_title')}>Gallery Title</th>
                <th scope="col" onClick={() => runSort('type')}>Type of Exhibition</th>
              </tr>
            </thead>
            <tbody>
            {search(sorted(items)).map((item) => (
              <tr className={item.status} key={item.id} >
                <td>{item.title}</td>
                <td className="text-start">{item.description}</td>
                <td>{item.is_featured ? 'Yes': 'No'}</td>
                <td>{item.gallery_title}</td>
                <td>{item.type}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          
        </div>
      </div>
    )
  }
}

export default App;
