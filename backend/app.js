const express = require("express");
const router = express();
const http = require('http');
const cors = require('cors');

// const https = require('https');
// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const fakeLocal = require('./fakeLocal.json');

// var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');

// const JWTStrategy = require('passport-jwt').Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config();

router.use(express.static('public'));
router.use(express.urlencoded({ extended:false }));
router.use(express.json());
router.use(cors());

const formatNumber = (number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format(number);

function buscarNombreTipo(list,id) {
  for(let j=0; j< list.length; j++){
    if(parseInt(list[j]['tipo_pago_id'])===parseInt(id))
      return list[j]['tipo_pago'];
  }
  return "";
}

function buscarNombreCategoria(list,id) {
  for(let j=0; j< list.length; j++){
    if(parseInt(list[j]['categoria_id'])===parseInt(id))
      return list[j]['categoria'];
  }
  return "";
}

router.get('/', async (req,res,next) => {
  const listaTipos = await prisma.typesusers.findMany({
    select: {
      typeuser_id: true,
      typeuser: true
    },
  });
  res.json({listaTipos});
});

router.post('/loguear', async (req,res, next) => {
  try{
    let user = await findUser(req.body.email,req.body.password);
    console.log("U: "+user)
    res.json({"usuario_id":user});
  }catch(e) {
    res.json({"usuario_id":0});
  }
});

async function findUser(email,password) {
  const users = await prisma.users.findFirst({
    where: {
      email,
      password
    },
    select: {
      user_id:true
    }
  });

  if(users == null)
    return 0;

  return users.user_id;
}

router.post('/obtenerIniciales', async (req,res, next) => {
  try{
      if(req.body.user_id!==null) {
        const id = req.body.user_id;
        const cliente = await prisma.clientes.findMany({
          where: {
            user_id : parseInt(id),
            activo : 1
          },
          select: {
            nombre: true,
            apellido: true,
          },
        });

        let resultado = "";
        if(cliente.length>0)
          resultado= cliente[0]['nombre'].substring(0,1)+""+cliente[0]['apellido'].substring(0,1);

        res.json({"iniciales":resultado});
      }
    }catch(e) {
      res.json({"iniciales":"00"});
  }
});

router.post('/crearUsuario', async (req,res, next) => {
  const nuevoUsuario = await prisma.users.create({
    data:{
      email: req.body.hdEmail,
      password: req.body.hdContrasenia,
      typeuser_id : 2,
      activo: 1
    }
  });
  res.json({"usuario_id":nuevoUsuario.user_id});
});

router.post('/crearCliente', async (req,res, next) => {
  let fecha = new Date().toISOString();
  const nuevoCliente = await prisma.clientes.create({
    data:{
      nombre: req.body.hdNombre,
      apellido: req.body.hdApellido,
      puesto: req.body.hdPuesto,
      celular: req.body.hdCelular,
      empresa: req.body.hdEmpresa,
      dedica_empresa: req.body.hdDedica,
      num_empleados: parseInt(req.body.hdNumEmpleados),
      fecha:fecha,
      user_id: req.body.hdUser_id,
      activo: 1
    }
  });
  res.json({"cliente_id":nuevoCliente.cliente_id});
});

router.post('/altaCajaBanco', async (req,res, next) => {
  const nuevoCajaBanco = await prisma.cajas_bancos.create({
    data:{
      nombre_cuenta: req.body.txtNombre,
      tipo_pago_id : parseInt(req.body.stTipo),
      cantidad_actual:  parseInt(req.body.txtCantidadActual),
      user_id:  parseInt(req.body.user_id),
      activo: 1
    }
  });
  res.json({"cajas_bancos_id":nuevoCajaBanco.cajas_bancos_id});
});

router.post('/editarCajaBanco', async (req,res,next) => {
  const id = parseInt(req.body.caja_banco_id);

  await prisma.cajas_bancos.update({
    where: {
      cajas_bancos_id : parseInt(id),
    },
    data: {
      nombre_cuenta: req.body.txtNombre,
      tipo_pago_id : parseInt(req.body.stTipo),
      cantidad_actual:  parseInt(req.body.txtCantidadActual),
    }
  });
  res.json({"status":"exito"});
});

router.post('/listCajasBancos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;//req.query.ordenPago;

    const listCajasBancos = await prisma.cajas_bancos.findMany({
      where: {
        user_id : parseInt(id)
      },
      select: {
        cajas_bancos_id: true,
        nombre_cuenta: true,
        tipo_pago_id:true,
        cantidad_actual: true,
        tipos_pagos: {
          select: {
            tipo_pago:true
          },
        },
      },
    });
    res.json({listCajasBancos});
  }
});

router.post('/listCajasBancosB', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    const nombre = req.body.busqueda;

    const listCajasBancos = await prisma.cajas_bancos.findMany({
      where: {
        user_id : parseInt(id),
        nombre_cuenta : {
          contains: nombre,
        },
      },
      select: {
        cajas_bancos_id: true,
        nombre_cuenta: true,
        tipo_pago_id:true,
        cantidad_actual: true,
        tipos_pagos: {
          select: {
            tipo_pago:true
          },
        },
      },
    });
    res.json({listCajasBancos});
  }
});

router.post('/resumenCajasBancos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    let dataCajasBancos = [];

    const listTiposPagos = await prisma.tipos_pagos.findMany({
      select: {
        tipo_pago_id: true,
        tipo_pago: true,
      },
    });

    const listCajasBancos = await prisma.cajas_bancos.groupBy({
      by: ['tipo_pago_id'],
      where: {
        user_id : parseInt(id)
      },
      _count: {
        tipo_pago_id: true,
      },
      _sum: {
        cantidad_actual: true,
      },
    });

    let saldTot=0;
    for(let j=0; j< listCajasBancos.length; j++){
      let item = {
        "tipo": buscarNombreTipo(listTiposPagos,listCajasBancos[j]['tipo_pago_id']),
        "cantidad": listCajasBancos[j]['_count']['tipo_pago_id'],
        "total": "$"+formatNumber(listCajasBancos[j]['_sum']['cantidad_actual']),
      }
      dataCajasBancos.push(item);
      saldTot += parseInt(listCajasBancos[j]['_sum']['cantidad_actual'])
    }

    let item = {
      "tipo": "",
      "cantidad": "Total",
      "total": "$"+formatNumber(saldTot),
    }
    dataCajasBancos.push(item);

    res.json({dataCajasBancos});
  }
});

router.post('/resumenIngresosFuturos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    let dataIngresosFuturos = [];
 
    const rGeneral = await prisma.ingresos_futuros.groupBy({
      by: ['user_id'],
      where: {
        user_id : parseInt(id),
        activo : true
      },
      _count: {
        user_id: true,
      },
      _sum: {
        monto: true,
      },
    });

    if(rGeneral.length>0) {
      let item = {
        "titulo": "Número de registros",
        "cantidad": rGeneral[0]['_count']['user_id'],
      }
      dataIngresosFuturos.push(item);

      item = {
        "titulo": "Total en ingreso",
        "cantidad": "$"+formatNumber(rGeneral[0]['_sum']['monto']),
      }
      dataIngresosFuturos.push(item); 
    }

    const listTiposPagos = await prisma.tipos_pagos.findMany({
      select: {
        tipo_pago_id: true,
        tipo_pago: true,
      },
    });

    const listIngresoMetodos = await prisma.ingresos_futuros.groupBy({
      by: ['tipo_pago_id'],
      where: {
        user_id : parseInt(id),
        activo : true
      },
      _count: {
        tipo_pago_id: true,
      },
      _sum: {
        monto: true,
      },
    });

    if(listIngresoMetodos.length>0) {
      item = {
        "titulo": "Métodos",
        "cantidad": "",
        "colSpan": 2,
      }
      dataIngresosFuturos.push(item);

      for(let j=0; j< listIngresoMetodos.length; j++){
        let item = {
          "titulo": "Total de registros en "+buscarNombreTipo(listTiposPagos,listIngresoMetodos[j]['tipo_pago_id']),
          "cantidad": listIngresoMetodos[j]['_count']['tipo_pago_id'],
        }
        dataIngresosFuturos.push(item);
      }

      for(let j=0; j< listIngresoMetodos.length; j++){
        let item = {
          "titulo": "Total en "+buscarNombreTipo(listTiposPagos,listIngresoMetodos[j]['tipo_pago_id']),
          "cantidad": "$"+formatNumber(listIngresoMetodos[j]['_sum']['monto']),
        }
        dataIngresosFuturos.push(item);
      }
    }

    const listCategorias = await prisma.categorias.findMany({
      select: {
        categoria_id: true,
        categoria: true,
      },
    });

    const listIngresoCategorias = await prisma.ingresos_futuros.groupBy({
      by: ['categoria_id'],
      where: {
        user_id : parseInt(id),
        activo : true
      },
      _count: {
        categoria_id: true,
      },
      _sum: {
        monto: true,
      },
    });

    if(listIngresoCategorias.length>0) {
      item = {
        "titulo": "Categorias",
        "cantidad": "",
        "colSpan": 2,
      }
      dataIngresosFuturos.push(item);

      for(let j=0; j< listIngresoCategorias.length; j++){
        let item = {
          "titulo": "Total de registros en "+buscarNombreCategoria(listCategorias,listIngresoCategorias[j]['categoria_id']),
          "cantidad": listIngresoCategorias[j]['_count']['categoria_id'],
        }
        dataIngresosFuturos.push(item);
      }

      for(let j=0; j< listIngresoCategorias.length; j++){
        let item = {
          "titulo": "Total en "+buscarNombreCategoria(listCategorias,listIngresoCategorias[j]['categoria_id']),
          "cantidad": "$"+formatNumber(listIngresoCategorias[j]['_sum']['monto']),
        }
        dataIngresosFuturos.push(item);
      }
    }

    res.json({dataIngresosFuturos});
  }
});



router.post('/resumenEgresosFuturos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    let dataEgresosFuturos = [];

    const rGeneral = await prisma.egresos_futuros.groupBy({
      by: ['user_id'],
      where: {
        user_id : parseInt(id),
        activo : true
      },
      _count: {
        user_id: true,
      },
      _sum: {
        monto: true,
      },
    });

    if(rGeneral.length>0) {
      let item = {
        "titulo": "Número de registros",
        "cantidad": rGeneral[0]['_count']['user_id'],
      }
      dataEgresosFuturos.push(item);

      item = {
        "titulo": "Total en egreso",
        "cantidad": "$"+formatNumber(rGeneral[0]['_sum']['monto']),
      }
      dataEgresosFuturos.push(item);
    }

    const listTiposPagos = await prisma.tipos_pagos.findMany({
      select: {
        tipo_pago_id: true,
        tipo_pago: true,
      },
    });

    const listEgresoMetodos = await prisma.egresos_futuros.groupBy({
      by: ['tipo_pago_id'],
      where: {
        user_id : parseInt(id),
        activo : true
      },
      _count: {
        tipo_pago_id: true,
      },
      _sum: {
        monto: true,
      },
    });

    if(listEgresoMetodos.length>0) {
      item = {
        "titulo": "Métodos",
        "cantidad": "",
        "colSpan": 2,
      }
      dataEgresosFuturos.push(item);

      for(let j=0; j< listEgresoMetodos.length; j++){
        let item = {
          "titulo": "Total de registros en "+buscarNombreTipo(listTiposPagos,listEgresoMetodos[j]['tipo_pago_id']),
          "cantidad": listEgresoMetodos[j]['_count']['tipo_pago_id'],
        }
        dataEgresosFuturos.push(item);
      }

      for(let j=0; j< listEgresoMetodos.length; j++){
        let item = {
          "titulo": "Total en "+buscarNombreTipo(listTiposPagos,listEgresoMetodos[j]['tipo_pago_id']),
          "cantidad": "$"+formatNumber(listEgresoMetodos[j]['_sum']['monto']),
        }
        dataEgresosFuturos.push(item);
      }
    }

    const listCategorias = await prisma.categorias.findMany({
      select: {
        categoria_id: true,
        categoria: true,
      },
    });

    const listEgresoCategorias = await prisma.egresos_futuros.groupBy({
      by: ['categoria_id'],
      where: {
        user_id : parseInt(id),
        activo : true
      },
      _count: {
        categoria_id: true,
      },
      _sum: {
        monto: true,
      },
    });

    if(listEgresoCategorias.length>0) {
      item = {
        "titulo": "Categorias",
        "cantidad": "",
        "colSpan": 2,
      }
      dataEgresosFuturos.push(item);

      for(let j=0; j< listEgresoCategorias.length; j++){
        let item = {
          "titulo": "Total de registros en "+buscarNombreCategoria(listCategorias,listEgresoCategorias[j]['categoria_id']),
          "cantidad": listEgresoCategorias[j]['_count']['categoria_id'],
        }
        dataEgresosFuturos.push(item);
      }


      for(let j=0; j< listEgresoCategorias.length; j++){
        let item = {
          "titulo": "Total en "+buscarNombreCategoria(listCategorias,listEgresoCategorias[j]['categoria_id']),
          "cantidad": "$"+formatNumber(listEgresoCategorias[j]['_sum']['monto']),
        }
        dataEgresosFuturos.push(item);
      }
    }

    res.json({dataEgresosFuturos});
  }
});


router.post('/altaIngresoFuturo', async (req,res, next) => {
  let fechaCreacion = new Date().toISOString();
  const nuevoIngresoFuturo = await prisma.ingresos_futuros.create({
    data:{
      nombre_persona_empresa: req.body.txtNombre,
      concepto: req.body.txtConcepto,
      tipo_pago_id: parseInt(req.body.stTipo),
      categoria_id: parseInt(req.body.stCategoria),
      monto: parseInt(req.body.txtMonto),
      fecha_tentativa_cobro: req.body.txtFechaTentativaCobro,
      user_id: parseInt(req.body.user_id),
      fecha_creacion: fechaCreacion,
      borrado: false,
      activo: true
    }
  });
  res.json({"ingresos_futuros_id":nuevoIngresoFuturo.ingresos_futuros_id});
});

router.post('/editarIngresoFuturo', async (req,res,next) => {
  const id = parseInt(req.body.ingresos_futuros_id);

   await prisma.ingresos_futuros.update({
    where: {
      ingresos_futuros_id : parseInt(id),
    },
    data: {
      nombre_persona_empresa: req.body.txtNombre,
      concepto: req.body.txtConcepto,
      tipo_pago_id: parseInt(req.body.stTipo),
      categoria_id: parseInt(req.body.stCategoria),
      monto: parseInt(req.body.txtMonto),
      fecha_tentativa_cobro: req.body.txtFechaTentativaCobro,
    }
  });
  res.json({"status":"exito"});
});

router.post('/listIngresosFuturos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;

    const listIngresosFuturos = await prisma.ingresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        activo : true
      },
      select: {
        ingresos_futuros_id: true,
        nombre_persona_empresa: true,
        concepto: true,
        tipo_pago_id:true,
        categoria_id:true,
        monto: true,
        fecha_tentativa_cobro: true,
        fecha_creacion: true,
        fecha_cobro: true,
        borrado: true,
        tipos_pagos: {
          select: {
            tipo_pago:true
          },
        },
        categorias: {
          select: {
            categoria:true
          },
        },
      },
    });
    res.json({listIngresosFuturos});
  }
});

router.post('/listIngresosFuturosB', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    const nombre = req.body.busqueda;

    const listIngresosFuturos = await prisma.ingresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        nombre_persona_empresa : {
          contains: nombre,
        },
        activo : true
      },
      select: {
        ingresos_futuros_id: true,
        nombre_persona_empresa: true,
        concepto: true,
        tipo_pago_id:true,
        categoria_id:true,
        monto: true,
        fecha_tentativa_cobro: true,
        fecha_creacion: true,
        fecha_cobro: true,
        borrado: true,
        tipos_pagos: {
          select: {
            tipo_pago:true
          },
        },
        categorias: {
          select: {
            categoria:true
          },
        },
      },
    });
    res.json({listIngresosFuturos});
  }
});


router.post('/eliminarIngresoFuturo', async (req,res,next) => {
  const id = parseInt(req.body.ingresos_futuros_id);

  await prisma.ingresos_futuros.update({
    where: {
      ingresos_futuros_id : parseInt(id),
    },
    data: {
      activo: false
    }
  });
  res.json({"status":"exito"});
});

router.post('/CancelarIngresoFuturo', async (req,res,next) => {
  const id = parseInt(req.body.ingresos_futuros_id);

  await prisma.ingresos_futuros.update({
    where: {
      ingresos_futuros_id : parseInt(id),
    },
    data: {
      borrado: true
    }
  });
  res.json({"status":"exito"});
});


router.post('/cambiarCobrado', async (req,res, next) => {
  const id = parseInt(req.body.ingresos_futuros_id);
  const tipoFecha = parseInt(req.body.tipoFecha);
  const fechaRealizo = req.body.fechaRealizo;
  let fechaDeCobro;

  if(tipoFecha===1)
    fechaDeCobro = new Date().toISOString();
  else
    fechaDeCobro = fechaRealizo;

  await prisma.ingresos_futuros.update({
    where: {
      ingresos_futuros_id : parseInt(id),
    },
    data:{
      fecha_cobro:fechaDeCobro
    }
  });
  res.json({"status":"exito"});
});


router.post('/revertirCobro', async (req,res, next) => {
  const id = parseInt(req.body.ingresos_futuros_id);

  await prisma.ingresos_futuros.update({
    where: {
      ingresos_futuros_id : parseInt(id),
    },
    data:{
      fecha_cobro:null
    }
  });
  res.json({"status":"exito"});
});

router.post('/listIngresosFuturosFiltro', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = parseInt(req.body.user_id);
    const metodo_id = parseInt(req.body.metodo_id);
    const estado_id = parseInt(req.body.estado_id);

    let listIngresosFuturos;

    if(metodo_id !== 0) {
      listIngresosFuturos = await prisma.ingresos_futuros.findMany({
        where: {
          user_id : id,
          tipo_pago_id : metodo_id,
          activo : true
        },
        select: {
          ingresos_futuros_id: true,
          nombre_persona_empresa: true,
          concepto: true,
          tipo_pago_id:true,
          categoria_id:true,
          monto: true,
          fecha_tentativa_cobro: true,
          fecha_creacion: true,
          fecha_cobro: true,
          borrado: true,
          tipos_pagos: {
            select: {
              tipo_pago:true
            },
          },
          categorias: {
            select: {
              categoria:true
            },
          },
        },
      });
    }
    else {
      listIngresosFuturos = await prisma.ingresos_futuros.findMany({
        where: {
          user_id : id,
          activo : true
        },
        select: {
          ingresos_futuros_id: true,
          nombre_persona_empresa: true,
          concepto: true,
          tipo_pago_id:true,
          categoria_id:true,
          monto: true,
          fecha_tentativa_cobro: true,
          fecha_creacion: true,
          fecha_cobro: true,
          borrado: true,
          tipos_pagos: {
            select: {
              tipo_pago:true
            },
          },
          categorias: {
            select: {
              categoria:true
            },
          },
        },
      });
    }

    let listIngresosFuturosAux=[];

    if(estado_id !== 0) {
      for(let j=0; j < Object.keys(listIngresosFuturos).length; j++){
        if(estado_id === 1) {
          if(listIngresosFuturos[j]['fecha_cobro']!==null) {
            listIngresosFuturosAux.push(listIngresosFuturos[j]);
          }
        }
        else if(estado_id === 2) {
          if(listIngresosFuturos[j]['fecha_cobro']===null  && !listIngresosFuturos[j]['borrado']) {
            listIngresosFuturosAux.push(listIngresosFuturos[j]);
          }
        }
        else if(estado_id === 3) {
          if(Date.parse(new Date().toISOString()) > Date.parse(listIngresosFuturos[j]['fecha_tentativa_cobro']) && listIngresosFuturos[j]['fecha_cobro']===null && !listIngresosFuturos[j]['borrado']) {
            listIngresosFuturosAux.push(listIngresosFuturos[j]);
          }
        }
        else if(estado_id === 4) {
          if(listIngresosFuturos[j]['borrado']) {
            listIngresosFuturosAux.push(listIngresosFuturos[j]);
          }
        }
      }
      listIngresosFuturos = listIngresosFuturosAux;
    }

    res.json({listIngresosFuturos});
  }
});


router.post('/listConceptosIngresosFuturos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    let dataConceptos = [];

    const listConceptosIngresosFuturos = await prisma.ingresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        activo : true
      },
      distinct: ['concepto'],
      select: {
        concepto: true,
      },
    });

    for(let j=0; j< listConceptosIngresosFuturos.length; j++){
      let item = {
        "value": listConceptosIngresosFuturos[j]['concepto'],
      }
      dataConceptos.push(item);
    }

    res.json({dataConceptos});
  }
});


router.post('/altaEgresoFuturo', async (req,res, next) => {
  let fechaCreacion = new Date().toISOString();
  const nuevoEgresoFuturo = await prisma.egresos_futuros.create({
    data:{
      nombre_persona_empresa: req.body.txtNombre,
      concepto: req.body.txtConcepto,
      tipo_pago_id: parseInt(req.body.stTipo),
      categoria_id: parseInt(req.body.stCategoria),
      monto: parseInt(req.body.txtMonto),
      fecha_tentativa_pago: req.body.txtFechaTentativaPago,
      user_id: parseInt(req.body.user_id),
      fecha_creacion: fechaCreacion,
      borrado: false,
      activo: true
    }
  });
  res.json({"egresos_futuros_id":nuevoEgresoFuturo.egresos_futuros_id});
});

router.post('/editarEgresoFuturo', async (req,res,next) => {
  const id = parseInt(req.body.egresos_futuros_id);

  await prisma.egresos_futuros.update({
    where: {
      egresos_futuros_id : parseInt(id),
    },
    data: {
      nombre_persona_empresa: req.body.txtNombre,
      concepto: req.body.txtConcepto,
      tipo_pago_id: parseInt(req.body.stTipo),
      categoria_id: parseInt(req.body.stCategoria),
      monto: parseInt(req.body.txtMonto),
      fecha_tentativa_pago: req.body.txtFechaTentativaPago,
    }
  });
  res.json({"status":"exito"});
});

router.post('/listEgresosFuturos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;

    const listEgresosFuturos = await prisma.egresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        activo : true
      },
      select: {
        egresos_futuros_id: true,
        nombre_persona_empresa: true,
        concepto: true,
        tipo_pago_id:true,
        categoria_id:true,
        monto: true,
        fecha_tentativa_pago: true,
        fecha_creacion: true,
        fecha_pago: true,
        borrado: true,
        tipos_pagos: {
          select: {
            tipo_pago:true
          },
        },
        categorias: {
          select: {
            categoria:true
          },
        },
      },
    });
    res.json({listEgresosFuturos});
  }
});

router.post('/listEgresosFuturosB', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    const nombre = req.body.busqueda;

    const listEgresosFuturos = await prisma.egresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        nombre_persona_empresa : {
          contains: nombre,
        },
        activo : true
      },
      select: {
        egresos_futuros_id: true,
        nombre_persona_empresa: true,
        concepto: true,
        tipo_pago_id:true,
        categoria_id:true,
        monto: true,
        fecha_tentativa_pago: true,
        fecha_creacion: true,
        fecha_pago: true,
        borrado: true,
        tipos_pagos: {
          select: {
            tipo_pago:true
          },
        },
        categorias: {
          select: {
            categoria:true
          },
        },
      },
    });
    res.json({listEgresosFuturos});
  }
});

router.post('/eliminarEgresoFuturo', async (req,res,next) => {
  const id = parseInt(req.body.egresos_futuros_id);

  await prisma.egresos_futuros.update({
    where: {
      egresos_futuros_id : parseInt(id),
    },
    data: {
      activo: false
    }
  });
  res.json({"status":"exito"});
});

router.post('/CancelarEgresoFuturo', async (req,res,next) => {
  const id = parseInt(req.body.egresos_futuros_id);

  await prisma.egresos_futuros.update({
    where: {
      egresos_futuros_id : parseInt(id),
    },
    data: {
      borrado: true
    }
  });
  res.json({"status":"exito"});
});


router.post('/cambiarPagado', async (req,res, next) => {
  const id = parseInt(req.body.egresos_futuros_id);
  const tipoFecha = parseInt(req.body.tipoFecha);
  const fechaRealizo = req.body.fechaRealizo;
  let fechaDePago;

  if(tipoFecha===1)
    fechaDePago = new Date().toISOString();
  else
    fechaDePago = fechaRealizo;

  await prisma.egresos_futuros.update({
    where: {
      egresos_futuros_id : parseInt(id),
    },
    data:{
      fecha_pago:fechaDePago
    }
  });
  res.json({"status":"exito"});
});


router.post('/revertirPago', async (req,res, next) => {
  const id = parseInt(req.body.egresos_futuros_id);

  await prisma.egresos_futuros.update({
    where: {
      egresos_futuros_id : parseInt(id),
    },
    data:{
      fecha_pago:null
    }
  });
  res.json({"status":"exito"});
});


router.post('/listEgresosFuturosFiltro', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = parseInt(req.body.user_id);
    const metodo_id = parseInt(req.body.metodo_id);
    const estado_id = parseInt(req.body.estado_id);

    let listEgresosFuturos;

    if(metodo_id !== 0) {
      listEgresosFuturos = await prisma.egresos_futuros.findMany({
        where: {
          user_id : id,
          tipo_pago_id : metodo_id,
          activo : true
        },
        select: {
          egresos_futuros_id: true,
          nombre_persona_empresa: true,
          concepto: true,
          tipo_pago_id:true,
          categoria_id:true,
          monto: true,
          fecha_tentativa_pago: true,
          fecha_creacion: true,
          fecha_pago: true,
          borrado: true,
          tipos_pagos: {
            select: {
              tipo_pago:true
            },
          },
          categorias: {
            select: {
              categoria:true
            },
          },
        },
      });
    }
    else {
      listEgresosFuturos = await prisma.egresos_futuros.findMany({
        where: {
          user_id : id,
          activo : true
        },
        select: {
          egresos_futuros_id: true,
          nombre_persona_empresa: true,
          concepto: true,
          tipo_pago_id:true,
          categoria_id:true,
          monto: true,
          fecha_tentativa_pago: true,
          fecha_creacion: true,
          fecha_pago: true,
          borrado: true,
          tipos_pagos: {
            select: {
              tipo_pago:true
            },
          },
          categorias: {
            select: {
              categoria:true
            },
          },
        },
      });
    }

    let listEgresosFuturosAux=[];

    if(estado_id !== 0) {
      for(let j=0; j < Object.keys(listEgresosFuturos).length; j++){
        if(estado_id === 1) {
          if(listEgresosFuturos[j]['fecha_pago']!==null) {
            listEgresosFuturosAux.push(listEgresosFuturos[j]);
          }
        }
        else if(estado_id === 2) {
          if(listEgresosFuturos[j]['fecha_pago']===null && !listEgresosFuturos[j]['borrado']) {
            listEgresosFuturosAux.push(listEgresosFuturos[j]);
          }
        }
        else if(estado_id === 3) {
          if(Date.parse(new Date().toISOString()) > Date.parse(listEgresosFuturos[j]['fecha_tentativa_pago']) && listEgresosFuturos[j]['fecha_pago']===null && !listEgresosFuturos[j]['borrado']) {
            listEgresosFuturosAux.push(listEgresosFuturos[j]);
          }
        }
        else if(estado_id === 4) {
          if(listEgresosFuturos[j]['borrado']) {
            listEgresosFuturosAux.push(listEgresosFuturos[j]);
          }
        }
      }
      listEgresosFuturos = listEgresosFuturosAux;
    }

    res.json({listEgresosFuturos});
  }
});

router.post('/listConceptosEgresosFuturos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;
    let dataConceptos = [];

    const listConceptosEgresosFuturos = await prisma.egresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        activo : true
      },
      distinct: ['concepto'],
      select: {
        concepto: true,
      },
    });

    for(let j=0; j< listConceptosEgresosFuturos.length; j++){
      let item = {
        "value": listConceptosEgresosFuturos[j]['concepto'],
      }
      dataConceptos.push(item);
    }

    res.json({dataConceptos});
  }
});

router.post('/todos', async (req,res,next) => {
  if(req.body.user_id!==null) {
    const id = req.body.user_id;

    const listCajasBancos = await prisma.cajas_bancos.findMany({
      where: {
        user_id : parseInt(id)
      },
    });

    const listIngresosFuturos = await prisma.ingresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        activo : true
      },
    });

    const listEgresosFuturos = await prisma.egresos_futuros.findMany({
      where: {
        user_id : parseInt(id),
        activo : true
      },
    });

    res.json({"caja":listCajasBancos.length,"ingreso":listIngresosFuturos.length,"egreso":listEgresosFuturos.length});
  }
});
//story bug

// Servidor HTTP
// const serverHttp = http.createServer(router);
// serverHttp.listen(process.env.HTTP_PORT, process.env.IP);
// serverHttp.on('listening', () => console.info(`Notes App running at http://${process.env.IP}:${process.env.HTTP_PORT}`));
router.listen(3001, () => {
  console.log("Aplicación ejecutandose ....");
});

// Servidor HTTP
// const httpsServer = https.createServer(options, router);
// httpsServer.listen(443, process.env.IP);