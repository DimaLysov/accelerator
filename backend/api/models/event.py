from django.db import models

from api.models import Sport


class Event(models.Model):
    sport = models.ManyToManyField(Sport, verbose_name='Вид спорта', related_name='sports_event')
    name = models.CharField('Название', max_length=100)
    description = models.TextField('Описание', blank=True, default='')
    location = models.TextField('Местоположение', blank=True, default='')
    start_date = models.DateTimeField('Дата начала', blank=True, null=True)
    end_date = models.DateTimeField('Дата конца', blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Спортивное мероприятие'
        verbose_name_plural = 'Спортивные мероприятия'
