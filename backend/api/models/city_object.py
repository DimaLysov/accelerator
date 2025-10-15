from django.db import models

from api.models import ObjectType, Sport


class CityObject(models.Model):
    object_type = models.ForeignKey(ObjectType, verbose_name='Вид объекта', on_delete=models.PROTECT)
    sport = models.ForeignKey(Sport, verbose_name='Вид спорта', on_delete=models.PROTECT)
    name = models.CharField('Название', max_length=100)
    description = models.TextField('Описание', blank=True, default='')
    location = models.TextField('Местоположение', blank=True, default='')
    is_active = models.BooleanField('Активен', default=True)
    lat = models.FloatField("Широта", null=True, blank=True)
    lng = models.FloatField("Долгота", null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Спортивный объект'
        verbose_name_plural = 'Спортивные объекты'
