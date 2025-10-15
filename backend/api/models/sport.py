from django.db import models

class Sport(models.Model):
    name = models.CharField('Название',max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Спорт'
        verbose_name_plural = 'Виды спорта'