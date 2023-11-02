import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Surveys } from '../../models/surveys';
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent {
  survey: Surveys = {
    username: '',
    age: 0,
    phone: 0,
    firstQuestion: '',
    secondQuestion: '',
    thirdQuestion: '',
  };
  message: string = '';
  isSubmitting: boolean = false;

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  submitSurvey(): void {
    this.isSubmitting = true;
    const forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        'submit',
        function (event: any) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add('was-validated');
        },
        false
      );
    });

    if (!this.validateForm()) {
      console.warn('Datos de repartidor no válidos');
      this.isSubmitting = false;
      return;
    }

    this.databaseService.saveSurvey(this.survey).subscribe({
      next: () => {
        this.message = 'Survey guardado correctamente';
        setTimeout(() => {
          this.resetForm();
          this.survey = {
            username: '',
            age: 0,
            phone: 0,
            firstQuestion: '',
            secondQuestion: '',
            thirdQuestion: '',
          };
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        this.message = 'Error al guardar el survey';
        console.error(this.message, error);
        setTimeout(() => {
          this.resetForm();
        }, 1500);
      },
    });
  }

  private validateForm(): any {
    return (
      this.survey.username &&
      this.survey.age >= 18 &&
      this.survey.age < 100 &&
      this.survey.phone &&
      this.survey.firstQuestion &&
      this.survey.secondQuestion &&
      this.survey.thirdQuestion
    );
  }

  private resetForm(): void {
    this.message = '';
    this.isSubmitting = false;
  }
}
