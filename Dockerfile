FROM postgres:17

RUN apt-get update && \
    apt-get install -y locales && \
    echo "pl_PL.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen pl_PL.UTF-8

ENV LANG pl_PL.UTF-8
ENV LANGUAGE pl_PL.UTF-8
ENV LC_ALL pl_PL.UTF-8

EXPOSE 5432
