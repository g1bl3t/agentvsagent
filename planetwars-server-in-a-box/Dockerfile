FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y build-essential libz-dev
RUN apt-get install -y supervisor
RUN apt-get install -y cron

RUN apt-get install -y apache2
RUN a2enmod cgi # enable apache cgi module
RUN a2enmod headers


WORKDIR /home
COPY web /var/www
COPY docker-entrypoint.sh /home/docker-entrypoint.sh
COPY server server
COPY supervisord.conf /home/supervisord.conf
COPY apache-config.conf /etc/apache2/sites-enabled/000-default.conf
COPY maps maps
COPY maps /var/www/maps

RUN cd server && make all
RUN cd server/htdocs && make all && make install
RUN cd server/BayesElo && make

RUN echo "* * * * * /home/server/rate.sh" > /etc/cron.d/rate
RUN chmod 0644 /etc/cron.d/rate
RUN crontab /etc/cron.d/rate

EXPOSE 80
EXPOSE 995

ENTRYPOINT ["/home/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/home/supervisord.conf"]
