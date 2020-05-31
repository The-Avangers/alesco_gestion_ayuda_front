import { Component, OnInit } from '@angular/core';

import {RequestService} from '../services/request/request.service';
import {Request} from '../services/request/request.interface';
import {ResponseService} from '../services/response/response.service';
import {Response} from '../services/response/response.interface';
import {Aid} from '../services/aid/aid.interface';
import {AidService} from '../services/aid/aid.service';
import {NotifierService} from 'angular-notifier';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
    requests: Request[] = [];
    search = '';
    role: string;
    id: number;
    months = {
        0: 'Enero',
        1: 'Febrero',
        2: 'Marzo',
        3: 'Abril',
        4: 'Mayo',
        5: 'Junio',
        6: 'Julio',
        7: 'Agosto',
        8: 'Septiembre',
        9: 'Octubre',
        10: 'Noviembre',
        11: 'Diciembre',
    };
    isLoading = true;
    aid: Aid;

  constructor(private requestService: RequestService, private responseService: ResponseService, private aidService: AidService,
              private notifierService: NotifierService, private router: Router) { }

  ngOnInit() {
      this.role = localStorage.getItem('Role');
      this.id = JSON.parse(localStorage.getItem('User')).id;
      if (this.role !== 'Administrador' && this.role !== 'Solicitante') {
          return this.notifierService.show({
              type: 'error',
              message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
          });
      }
      if (this.role === 'Administrador') {
          this.requestService.getRequests()
              .subscribe(response => {
                  this.isLoading = false;
                  this.requests = response;
                  this.requests = this.requests.map(value => {
                      const date = new Date(value.created_at);
                      // @ts-ignore
                      value.created_at = `${date.getDate()} de ${this.months[date.getMonth()]} de ${date.getFullYear()}`;
                      return value;
                  });
              }, error => {
                  this.isLoading = false;
                  this.notifierService.show({
                      type: 'error',
                      message: 'Error al Obtener Las Solicitudes'
                  });
              });
      }
      if (this.role === 'Solicitante') {
          console.log(this.id);
          this.requestService.getSolRequests(this.id)
              .subscribe(response => {
                  this.isLoading = false;
                  this.requests = response;
                  this.requests = this.requests.map(value => {
                      const date = new Date(value.created_at);
                      // @ts-ignore
                      value.created_at = `${date.getDate()} de ${this.months[date.getMonth()]} de ${date.getFullYear()}`;
                      return value;
                  });
              }, error => {
                  this.isLoading = false;
                  console.log(error.error);
                  this.notifierService.show({
                      type: 'error',
                      message: 'Error al Obtener Las Solicitudes'
                  });
              });
      }
  }
  reloadCurrentRoute() {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([currentUrl]);
        });
  }
  getAidbyId(req: Request) {
      this.aidService.getAidById(req.id_aid)
          .subscribe(response => {
              this.aid = response;
              console.log(this.aid.unit);
              this.approveRequest(req);
          }, error => {
              this.isLoading = false;
              console.log(error.error);
              this.reloadCurrentRoute();
              this.notifierService.show({
                  type : 'error',
                  message: 'Error al Obtener La Cantidad Disponible en el Insumo correspondiente a la solicitud Seleccionada'
              });
          });
  }
  deniedRequest(req: Request) {
      console.log(req.aid);
      Swal.fire({
          title: 'Desea Rechazar la Solicitud?',
          // text: 'You won\'t be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.value) {
              const body: Response = {
                  approved: false,
                  unit: null,
                  id_req: req.id
              };
              this.responseService.postResponse(body)
                  .subscribe(response => {
                      this.notifierService.show({
                          type: 'success',
                          message: 'La Solicitud fue Negada Exitosamente'
                      });
                      this.reloadCurrentRoute();
                  }, error => {
                      console.log(error);
                      this.notifierService.show({
                          type: 'error',
                          message: 'Error al Negar la Solicitud'
                      });
                  });
          }
      });
  }
  async approveRequest(req: Request) {
       const {value: units} = await Swal.fire({
          title: 'Cuál es la Cantidad a Asignar?',
          icon: 'question',
          input: 'range',
          inputAttributes: {
              min: '1',
              max: String(this.aid.unit),
              step: '1'
          },
          inputValue: '1'
       });
       if (units) {
          const body: Response = {
              approved: true,
              unit: units,
              id_req: req.id
          };
          this.responseService.postResponse(body)
              .subscribe(response => {
                  this.notifierService.show({
                      type: 'success',
                      message: 'Aprobada la Solicitud con la Asignación de ' + units +  'unidades de ' + req.aid
                  });
                  this.reloadCurrentRoute();
              }, error => {
                  console.log(error);
                  this.notifierService.show({
                      type: 'error',
                      message: 'Error al Aprobar la Solicitud'
                  });
              });
      }
  }

}
