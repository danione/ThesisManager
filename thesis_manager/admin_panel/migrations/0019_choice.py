# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20161103114236 on 2017-02-11 22:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel', '0018_auto_20170211_2148'),
    ]

    operations = [
        migrations.CreateModel(
            name='Choice',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('number', models.IntegerField()),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_panel.Student')),
                ('thesis', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='admin_panel.Thesis')),
            ],
        ),
    ]
