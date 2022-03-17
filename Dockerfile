FROM ubuntu as builder

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
	apt-get install -y build-essential cmake clang openssl libssl-dev zlib1g-dev gperf wget git && \
	rm -rf /var/lib/apt/lists/*

ENV CC clang
ENV CXX clang++

RUN apt-get update
RUN apt-get install software-properties-common -y

WORKDIR /
RUN git clone --recursive https://github.com/doronaviguy/ton
WORKDIR /ton

RUN git submodule update && git submodule init

RUN rm -rf CMakeFiles CMakeCache.txt && \
  mkdir build

WORKDIR /ton/build

RUN cmake --configure ..

RUN cmake --build . --target lite-client

WORKDIR /ton