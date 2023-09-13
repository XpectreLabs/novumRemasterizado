import React, { useEffect }                     from "react";
import style                                    from "../../../pages/home/home.module.scss";
import { Space, Table, Tag, Button, Col, Row }  from "antd";
import type { ColumnsType }                     from "antd/es/table";
import { useState }                             from "react";

const user_id = localStorage.getItem("user_id");

interface DataType {
  tipo:     string;
  cantidad: number;
  total:    string;
}

const columns: ColumnsType<DataType> = [
  {
    title:      "Tipo",
    dataIndex:  "tipo",
    render:     (text) => <strong>{text}</strong>,
  },
  {
    title:      "Cantidad",
    dataIndex:  "cantidad",
  },
  {
    title:      "Total de dinero",
    dataIndex:  "total",
    render:     (text) => <strong>{text}</strong>,
  },
];

interface DataType2 {
  titulo:   string;
  cantidad: string;
  colSpan?: number;
}

const columns2: ColumnsType<DataType2> = [
  {
    title:      "",
    dataIndex:  "titulo",
    render:     (text) => <strong>{text}</strong>,
  },
  {
    title:      "",
    dataIndex:  "cantidad",
  },
];

function cargarDatos(
  setListCajaBanco: any,
  setListIngresos:  any,
  setListEgresos:   any
) {
  let scriptURL = localStorage.getItem("site") + "/resumenCajasBancos";
  let dataUrl   = { user_id };

  fetch(scriptURL, {
    method: "POST",
    body:   JSON.stringify(dataUrl),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(function (info) {
      //console.log     ("Data:");
      //console.log     (info);
      //console.log     (info["dataCajasBancos"]);
      setListCajaBanco(info["dataCajasBancos"]);
    })
    .catch((error) => {
      console.log   (error.message);
      console.error ("Error!", error.message);
    });

  scriptURL = localStorage.getItem("site") + "/resumenIngresosFuturos";
  fetch(scriptURL, {
    method: "POST",
    body:   JSON.stringify(dataUrl),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(function (info) {
      //console.log     ("Data 2:");
      //console.log     (info);
      //console.log     (info["dataIngresosFuturos"]);
      setListIngresos (info["dataIngresosFuturos"]);
    })
    .catch((error) => {
      console.log   (error.message);
      console.error ("Error!", error.message);
    });

  scriptURL = localStorage.getItem("site") + "/resumenEgresosFuturos";
  fetch(scriptURL, {
    method: "POST",
    body:   JSON.stringify(dataUrl),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(function (info) {
      //console.log   ("Data 2:");
      //console.log   (info);
      //console.log   (info["dataEgresosFuturos"]);
      setListEgresos(info["dataEgresosFuturos"]);
    })
    .catch((error) => {
      console.log   (error.message);
      console.error ("Error!", error.message);
    });
}

export const Reporte = () => {
  const [listCajaBanco, setListCajaBanco] = useState([]);
  const [listIngresos,  setListIngresos]  = useState([]);
  const [listEgresos,   setListEgresos]   = useState([]);

  if (
    listCajaBanco.length  === 0 ||
    listIngresos.length   === 0 ||
    listEgresos.length    === 0
  )
    cargarDatos(setListCajaBanco, setListIngresos, setListEgresos);

  return (
    <>
      <div      className = {style.TablaResumen}>
        <Row>
          <Col className = {style.colTabla}>
            <h2 className = {style.TitleColResumen}>
              <strong>Caja o banco</strong>
            </h2>
            <Table
              columns     = {columns}
              dataSource  = {listCajaBanco}
              pagination  = {false}
            />
          </Col>

          <Col className = {style.colTabla2}>
            <h2 className = {style.TitleColResumen}>
              <strong>Ingresos futuros</strong>
            </h2>
            <Table
              columns     = {columns2}
              dataSource  = {listIngresos}
              pagination  = {false}
            />
          </Col>

          <Col className = {style.colTabla3}>
            <h2 className = {style.TitleColResumen}>
              <strong>Egresos futuros</strong>
            </h2>
            <Table
              columns     = {columns2}
              dataSource  = {listEgresos}
              pagination  = {false}
            />
          </Col>
          <Col span={1}></Col>
        </Row>
      </div>
    </>
  );
};
