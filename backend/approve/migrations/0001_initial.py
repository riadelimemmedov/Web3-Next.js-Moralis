# Generated by Django 4.2.3 on 2023-07-26 16:50

import config.helpers
from django.db import migrations, models
import django_extensions.db.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Approve',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('approvment_id', django_extensions.db.fields.RandomCharField(blank=True, editable=False, include_alpha=False, length=15, unique=True, verbose_name='Approvment account id')),
                ('approvment_slug', django_extensions.db.fields.AutoSlugField(blank=True, editable=False, null=True, populate_from='approvment_id', unique=True, verbose_name='Approvment slug value')),
                ('approvment_hash', models.CharField(max_length=100, verbose_name='Approvment hash')),
                ('confirmed_account', models.CharField(max_length=100, validators=[config.helpers.validate_metamask_address], verbose_name='Confirmed account')),
                ('confirming_account', models.CharField(max_length=100, validators=[config.helpers.validate_metamask_address], verbose_name='Confirming account')),
                ('amount', models.FloatField(blank=True, validators=[config.helpers.validate_amount], verbose_name='Amount of approve')),
                ('is_approve', models.BooleanField(default=False, verbose_name='Is approve')),
                ('confirmations', models.IntegerField(default=0, verbose_name='Confirmed approvement value')),
            ],
            options={
                'verbose_name': 'Approve',
                'verbose_name_plural': 'Approvements',
            },
        ),
    ]
