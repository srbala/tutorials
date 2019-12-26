import React, { useState, useEffect } from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import logo from './logo.png';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.css';

const App = () => {
  const [cars, setCars] = useState(null);
  const [car, setCar] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isNewCar, setIsNewCar] = useState(false);
  const [displayDialog, setDisplayDialog] = useState(false);

  useEffect(() => {
    fetch('demo/data/cars-small.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch.');
            }

            return response.json();
        })
        .then(carData => {
          setCars(carData.data);
        })
        .catch(err => {
            console.log(err);
        });
  }, []);

  const findSelectedCarIndex = () => cars.indexOf(selectedCar);
  const updateProperty = (property, value) => {
    let data = {...car};
    data[property] = value;
    setCar(data);
  };

  /* CRUD operations */
  const onAdd = () => {
    setIsNewCar(true);
    setCar({vin: '', year: '', brand: '', color: ''});
    setDisplayDialog(true);
  };
  const onDelete = () => {
    let index = findSelectedCarIndex();
    
    setCars(cars.filter((val, i) => i !== index));
    setSelectedCar(null);
    setCar(null);
    setDisplayDialog(false);
  };
  const onSave = () => {
    let data = [...cars];
    if (isNewCar)
      data.push(car);
    else
      data[findSelectedCarIndex()] = car;
    
    setCars(data);
    setSelectedCar(null);
    setCar(null);
    setDisplayDialog(false);
  };

  const onCarSelect = (e) => {
    setIsNewCar(false);
    setDisplayDialog(true);
    setCar({...e.data});
  };

  let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>CRUD for Cars</div>;
  let footer = <div className="p-clearfix" style={{width: '100%'}}>
      <Button style={{float: 'left'}} label="Add" icon="pi pi-plus" onClick={onAdd} />
    </div>;

  let dialogFooter = <div className="p-clearfix">
    <Button label="Delete" icon="pi pi-times" onClick={onDelete} />
    <Button label="Save" icon="pi pi-check" onClick={onSave} />
  </div>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to PrimeReact</h2>
      </header>

      <div className="App-intro p-grid p-justify-center p-nogutter">
        <DataTable value={cars} paginator={true} rows={10} style={{width: '60%'}} header={header} footer={footer}
          selectionMode="single" selection={selectedCar} onSelectionChange={(e) => setSelectedCar(e.value)} onRowSelect={onCarSelect}>
            <Column field="vin" header="Vin" sortable={true} />
            <Column field="year" header="Year" sortable={true} />
            <Column field="brand" header="Brand" sortable={true} />
            <Column field="color" header="Color" sortable={true} />
        </DataTable>

        <Dialog visible={displayDialog} style={{width: '300px'}} header="Car Details" modal={true} footer={dialogFooter} onHide={() => setDisplayDialog(false)}>
          {
            car && <div className="p-grid p-fluid">
                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="vin">Vin</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="vin" onChange={(e) => {updateProperty('vin', e.target.value)}} value={car.vin}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="year">Year</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="year" onChange={(e) => {updateProperty('year', e.target.value)}} value={car.year}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="brand">Brand</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="brand" onChange={(e) => {updateProperty('brand', e.target.value)}} value={car.brand}/>
                                </div>
                                
                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="color">Color</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="color" onChange={(e) => {updateProperty('color', e.target.value)}} value={car.color}/>
                                </div>
                            </div>
          }
        </Dialog>
      </div>
    </div>
  );
}

export default App;
