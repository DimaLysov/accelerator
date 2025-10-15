from django.db import models

class ObjectType(models.Model):
    name = models.CharField('Название',max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'вид объекта'
        verbose_name_plural = 'Виды объектов'