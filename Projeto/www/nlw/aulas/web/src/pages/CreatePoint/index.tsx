import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/dropzone'


interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUfResponse {
    sigla: string;
}

interface IBGECityResponse { nome: string }


const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0'); //estado criado para armazenar os inputs do usuario.
    //inicializado com ZERO pq eh o mesmo valor informado 
    //como inicialização na lista la embaixo.

    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [InitialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' })
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        })
    }, []);




    useEffect(() => {
        api.get('items').then(response => { setItems(response.data); });
    }, []);

    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const uFInitials = response.data.map(uf => uf.sigla);
            setUfs(uFInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });
    }, [selectedUf]); //o segundo array indica qnd q vai ser executado

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition(
            [
                event.latlng.lat,
                event.latlng.lng,
            ]

        )
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({
            ...formData, [name]: value
        });

    }

    function handleSelecteditem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }
        else {
            setSelectedItems([...selectedItems, id]);
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
       /*  const data = {
             name, 
             email, 
             whatsapp, 
             uf, 
             city, 
             latitude, 
             longitude, 
             items
         }*/
        //função global que permite q envie arquivos . é o multipart
        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectedFile) {
            data.append('image', selectedFile);
        }
         await api.post('points', data);
        alert("cadastrado");
        history.push('/');
    }



    return (
        <div id="page-create-point">

            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft>
                        Voltar para home
                 </FiArrowLeft>
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1> Cadastro do <br />ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile}></Dropzone>

                <fieldset>
                    <legend>
                        <h2> Dados </h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                        <div className="field group">

                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    id="whatsapp"
                                    onChange={handleInputChange}
                                />
                            </div>

                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2> Endereço </h2>
                        <span>Selecione o Endereço no mapa</span>
                    </legend>
                    <Map center={InitialPosition} zoom={15} onCLick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>
                    <div className="field group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                                <option value="0">Selecione a UF</option>
                                {
                                    ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>

                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                                <option value="0">Selecione a Cidade</option>
                                {
                                    cities.map(city => (
                                        <option key={city} value={city}>{city}</option>

                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2> Itens de Coleta </h2>
                        <span>Selecione um ou mais itens abaixo</span>

                    </legend>
                    <ul className="items-grid">

                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelecteditem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''} >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}


                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )

}
export default CreatePoint;