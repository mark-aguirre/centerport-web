package com.centerport.config;

import com.centerport.common.dto.PagedResponse;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;

import java.util.List;

class CacheSerializerProbeTest {

    private PolymorphicTypeValidator ptv() {
        return BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.centerport.")
                .allowIfSubType("java.util.")
                .allowIfSubType("java.time.")
                .build();
    }

    private PagedResponse<String> sample() {
        return PagedResponse.<String>builder()
                .content(List.of("a", "b"))
                .page(0).size(20).totalElements(2).totalPages(1)
                .first(true).last(true).hasNext(false).hasPrevious(false)
                .build();
    }

    private void run(String label, GenericJackson2JsonRedisSerializer ser) {
        System.out.println("### " + label);
        try {
            byte[] bytes = ser.serialize(sample());
            System.out.println("JSON: " + new String(bytes));
            Object back = ser.deserialize(bytes);
            System.out.println("TYPE: " + (back == null ? "null" : back.getClass().getName()));
        } catch (Exception e) {
            System.out.println("EX: " + e.getMessage());
        }
    }

    @Test
    void probe() {
        // A: plain default constructor (no custom mapper)
        run("A-default", new GenericJackson2JsonRedisSerializer());

        // A2: plain default constructor, bare List at root
        GenericJackson2JsonRedisSerializer aser = new GenericJackson2JsonRedisSerializer();
        System.out.println("### A2-default-list");
        try {
            byte[] ab = aser.serialize(List.of(sample(), sample()));
            System.out.println("JSON: " + new String(ab));
            Object back = aser.deserialize(ab);
            System.out.println("TYPE: " + back.getClass().getName());
            System.out.println("ELEM: " + ((List<?>) back).get(0).getClass().getName());
        } catch (Exception ex) {
            System.out.println("EX: " + ex.getMessage());
        }

        // B: custom mapper, NO manual typing, with PTV set
        ObjectMapper b = new ObjectMapper();
        b.registerModule(new JavaTimeModule());
        b.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        b.setPolymorphicTypeValidator(ptv());
        run("B-nomanual", new GenericJackson2JsonRedisSerializer(b));

        // C: custom mapper, NO manual typing, NO PTV, NO visibility override
        ObjectMapper c = new ObjectMapper();
        c.registerModule(new JavaTimeModule());
        run("C-modulesonly", new GenericJackson2JsonRedisSerializer(c));

        // D: EVERYTHING + As.PROPERTY
        ObjectMapper d = new ObjectMapper();
        d.registerModule(new JavaTimeModule());
        d.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        d.activateDefaultTyping(ptv(), ObjectMapper.DefaultTyping.EVERYTHING, JsonTypeInfo.As.PROPERTY);
        run("D-everything-property", new GenericJackson2JsonRedisSerializer(d));

        // E: original config — NON_FINAL + As.PROPERTY
        ObjectMapper e = new ObjectMapper();
        e.registerModule(new JavaTimeModule());
        e.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        e.activateDefaultTyping(ptv(), ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
        run("E-nonfinal-property", new GenericJackson2JsonRedisSerializer(e));

        // G: NON_FINAL + WRAPPER_ARRAY — single object
        ObjectMapper g = new ObjectMapper();
        g.registerModule(new JavaTimeModule());
        g.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        g.activateDefaultTyping(ptv(), ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.WRAPPER_ARRAY);
        run("G-wrapperarray-object", new GenericJackson2JsonRedisSerializer(g));

        // H: NON_FINAL + WRAPPER_ARRAY — bare List (findByProfileId case)
        GenericJackson2JsonRedisSerializer gser = new GenericJackson2JsonRedisSerializer(g);
        System.out.println("### H-wrapperarray-list");
        try {
            byte[] hb = gser.serialize(List.of(sample(), sample()));
            System.out.println("JSON: " + new String(hb));
            Object back = gser.deserialize(hb);
            System.out.println("TYPE: " + back.getClass().getName());
            System.out.println("ELEM: " + ((List<?>) back).get(0).getClass().getName());
        } catch (Exception ex) {
            System.out.println("EX: " + ex.getMessage());
        }
    }
}
